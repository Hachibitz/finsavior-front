import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { BillRegisterRequest, TipoConta } from 'src/app/model/main.model';
import { AiAdviceRequest, AnalysisType, AnalysisTypeEnum } from 'src/app/model/ai-advice.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { ThemeService } from 'src/app/services/theme.service';
import { BillService } from 'src/app/services/bill.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';
import { RecurrentBillDialogComponent } from '../recurrent-bill-dialog/recurrent-bill-dialog.component';
import { FormsModule,
         ReactiveFormsModule, 
         Validators, 
         FormGroup, 
         FormBuilder, 
         FormControl} from '@angular/forms';
import { DialogMessage } from 'src/app/services/dialog-message.service';
import { AiAdviceDialogComponent } from '../ai-advice-dialog/ai-advice-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { UserData } from 'src/app/model/user.model';
import { Plan, PlanCoverageEnum, PlanEnum } from 'src/app/model/payment.model';
import { StringBuilder } from 'src/app/utils/StringBuilder';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const tabAnimation = trigger('tabAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.3s ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('0.3s ease-out', style({ opacity: 0 }))
  ])
]);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [
    NgbDropdownConfig, 
    HeaderBarComponent,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},],
  animations: [tabAnimation]
})
export class MainComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatSort) sort: MatSort;

  mainTableForm: FormGroup;
  cardTableForm: FormGroup;

  rows = new MatTableDataSource<any>([]);
  incomeRows = new MatTableDataSource<any>([]);
  cardRows = new MatTableDataSource<any>([]);

  ColumnMode = ColumnMode;
  loading: boolean = false;
  darkMode:boolean = false;

  displayedColumns: string[] = ['Nome', 'Valor', 'Tipo', 'Descricao', 'Data', 'Acoes'];
  cardDisplayedColumns: string[] = ['Nome', 'Valor', 'Descricao', 'Data', 'Acoes'];

  selectedType: string;
  
  billName: string = '';
  billValue: number;
  billDescription: string;
  billDate: Date;
  cardBillName: string;
  cardBillValue: number;
  cardBillDescription: string;
  liquidStatus: number = 0;
  liquidAndRightsStatus: number = 0;
  totalDebit;
  totalLeft;
  totalPaid;
  currentlyAvailableIncome;
  filterStatus: string = 'todos';
  analysisTypes: AnalysisType[] = [AnalysisTypeEnum.FREE, AnalysisTypeEnum.TRIMESTER, AnalysisTypeEnum.ANNUAL];

  userData: UserData;

  tableTypes: string[] = [
    'main',
    'credit-card'
  ]

  billTypes: TipoConta[] = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Passivo', value: 'Passivo' },
    { label: 'Caixa', value: 'Caixa' },
    { label: 'Poupança', value: 'Poupança' }
  ];

  ngOnInit(): void {
    this.darkMode = this.themeService.checkDarkMode();
    this.billDate = new Date();

    this.setTableData();
    this.setUserData();

    this.route.paramMap.subscribe(params => {
      const isRedirectToAiAnalysis = String(params.get('isRedirectToAiAnalysis'));
      if (isRedirectToAiAnalysis == 'ai-analysis-dialog') {
        this.openAiAdviceDialog();
      } else {
        this.router.navigate(['fs/main']);
      }
    });
  }

  ngAfterViewInit() {
    this.rows.sort = this.sort;
    this.cardRows.sort = this.sort;
    this.incomeRows.sort = this.sort;

    this.configureSorting();
    this.configureFiltering();
  }

  constructor(private cdRef: ChangeDetectorRef, 
    private themeService: ThemeService, 
    private billService: BillService, 
    private dialog: MatDialog, 
    private fb: FormBuilder, 
    private dialogMessage: DialogMessage,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const numberAndDecimalValidator = (control: FormControl) => {
      const valid = /^[0-9.]*$/.test(control.value);
      return valid ? null : { invalidNumber: true };
    };

    this.mainTableForm = this.fb.group({
      billName: ['', [Validators.required]],
      billValue: ['', [Validators.required, numberAndDecimalValidator, Validators.min(1)]],
      billDescription: [''],
      selectedType: ['', [Validators.required]]
    });

    this.cardTableForm = this.fb.group({
      cardBillName: ['', [Validators.required]],
      cardBillValue: ['', [Validators.required, numberAndDecimalValidator, Validators.min(1)]],
      cardBillDescription: ['']
    });

    this.syncFormDataAndFields();
  }

  configureSorting() {
    const sortAccessor = (data, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'Valor':
          return this.formatNumberToIncrement(data.Valor);
        default:
          return data[sortHeaderId];
      }
    };

    this.rows.sortingDataAccessor = sortAccessor;
    this.incomeRows.sortingDataAccessor = sortAccessor;
    this.cardRows.sortingDataAccessor = sortAccessor;
  }

  configureFiltering() {
    this.rows.filterPredicate = (data, filter: string) => {
      if (filter === 'todos') {
        return true;
      }
      return filter === 'pagos' ? data.Pago : !data.Pago;
    };
  }

  applyFilter(filterValue: string) {
    this.filterStatus = filterValue;
    this.rows.filter = filterValue;
  }

  syncFormDataAndFields(): void {
    this.mainTableForm.valueChanges.subscribe((formData) => {
      this.selectedType = formData.selectedType;
      this.billName = formData.billName;
      this.billValue = formData.billValue;
      this.billDescription = formData.billDescription;
    });

    this.cardTableForm.valueChanges.subscribe((formData) => {
      this.cardBillName = formData.cardBillName;
      this.cardBillValue = formData.cardBillValue;
      this.cardBillDescription = formData.cardBillDescription;
    });
  }

  setUserData(): void {
    this.isLoading();
    this.userService.getProfileData().then((result) => {
      this.userData = result;
    })
    .catch((error) => {
      this.dialogMessage.openErrorDialog(error.message);
    })
    .finally(() => {
      this.isLoading();
    });
  }

  async setTableData() {
    await this.loadMainTableData();
    await this.loadCardTableData();
    this.syncCardAndMainTableExpenses();
    this.setStatusData();
    this.setTotals();
  }

  onSelectDate(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    this.billDate = new Date(normalizedMonthAndYear);
    this.setTableData();
    datepicker.close();
  }

  toggleDarkMode() {
    /*this.darkMode = sessionStorage.getItem('dark-mode') == 'true' ? true : false;
    const mainBody = document.getElementById('mainBody');
    headerBar.classList.toggle('dark-mode', this.darkMode);*/
  }

  isMainTableFormValid(): boolean {
    const billValueControl = this.mainTableForm.get('billValue');
    const billNameControl = this.mainTableForm.get('billName');
    const selectedTypeControl = this.mainTableForm.get('selectedType');

    if(selectedTypeControl.invalid){ //(selectedTypeControl.dirty || selectedTypeControl.touched)
      this.dialogMessage.openWarnDialog('Selecione o tipo');
      return false;
    }
    if(billNameControl.invalid){
      this.dialogMessage.openWarnDialog('Campo de nome vazio');
      return false;
    }
    if(billValueControl.invalid){
      this.dialogMessage.openWarnDialog('Campo de valor vazio ou incorreto');
      return false;
    }
    return true;
  }

  isCardTableFormValid(): boolean {
    const cardBillValueControl = this.cardTableForm.get('cardBillValue');
    const cardBillNameControl = this.cardTableForm.get('cardBillName');

    if(cardBillNameControl.invalid){
      this.dialogMessage.openWarnDialog('Campo de nome vazio');
      return false;
    }
    if(cardBillValueControl.invalid){
      this.dialogMessage.openWarnDialog('Campo de valor vazio ou incorreto');
      return false;
    }
    return true;
  }

  openAiAdviceDialog(): void {
    const dialogRef = this.dialog.open(AiAdviceDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cancel') {
        
      } else {
        let haveCoverage: boolean = false;

        haveCoverage = this.validateSelectedAnalisysAndPlan(this.userData, result.analysisTypeId);
        if(!haveCoverage) {
          this.dialogMessage.openWarnDialog('Seu plano não possui a análise selecionada. Faça o upgrade agora mesmo com condições especiais!');
        }

        if(haveCoverage) {
          this.generateAiAdvice(result.analysisTypeId, result.selectedDate, result.temperature, result.finishDate).then((result) => {
            this.billDate = new Date();
            this.setTableData();
          });
        }
      }
    });
  }

  validateSelectedAnalisysAndPlan(userData: UserData, selectedAnalisys: number): boolean {
    const plan: Plan = PlanEnum.find(profilePlan => profilePlan.planId == userData.plan.planId);
    const coverageList: AnalysisType[] = Object.values(PlanCoverageEnum).find(planCoverage => planCoverage.planId === plan.planId).coverages;

    const chosenAnalysis: AnalysisType = coverageList.find(coverage => coverage.analysisTypeId == selectedAnalisys);

    if(chosenAnalysis) {
      return true;
    }

    return false;
  }

  addRecurrentRegister(event: Event) {
    const dialogRef = this.dialog.open(RecurrentBillDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'salvar') {
        this.addRegisterMain(event);
      } else {

      }
    });
  }

  addRegisterMain(event: Event) {
    if(!this.isMainTableFormValid()) {
      return;
    }

    const id = (event.target as HTMLElement).id;
    let billRegisterRequest: BillRegisterRequest = {
      id: null,
      billDate: this.formatData(this.billDate),
      billType: this.selectedType,
      billName: this.billName,
      billValue: this.billValue,
      billDescription: this.billDescription,
      billTable: this.tableTypes[0],
      isRecurrent: id == 'recurrent' ? true : false,
      paid: null
    };

    this.isLoading();
    this.billService.billRegister(billRegisterRequest)
      .then(result => {
        this.setTableData();
        this.dialogMessage.openInfoDialog('Registro salvo com sucesso!');
        this.cdRef.detectChanges();
        this.isLoading();
      })
      .catch(error => {
        this.dialogMessage.openErrorDialog('Falha ao inserir registro, tente novamente mais tarde.');
        this.isLoading();
      });
  }

  addRegisterCard() {
    if(!this.isCardTableFormValid()) {
      return;
    }

    let billRegisterRequest: BillRegisterRequest = {
      id: null,
      billDate: this.formatData(this.billDate),
      billType: null,
      billName: this.cardBillName,
      billValue: this.cardBillValue,
      billDescription: this.cardBillDescription,
      billTable: this.tableTypes[1],
      isRecurrent: false,
      paid: null
    };

    this.isLoading();
    this.billService.billRegister(billRegisterRequest)
      .then(result => {
        this.setTableData();
        this.dialogMessage.openInfoDialog('Registro salvo com sucesso!');
        this.cdRef.detectChanges();
        this.isLoading();
      })
      .catch(error => {
        this.dialogMessage.openErrorDialog('Falha ao inserir registro, tente novamente mais tarde.');
        this.isLoading();
      });
  }

  selectRegisterType() {
    //console.log(this.selectedType);
  }

  isLoading() {
    this.loading = !this.loading;
  }

  formatData(date: Date): string {
    const dateString = date.toString();
    const parts = dateString.split(' ');

    const month = parts[1];
    const year = parts[3];

    return month+' '+year;
  }

  refreshTablesAndStatus(tableData: any): void {
    if(tableData.mainTableDataList) {
      tableData.mainTableDataList.forEach((row) => {
        if (row.billType === 'Caixa' || row.billType === 'Ativo' || row.billType === 'Poupança') {
          this.incomeRows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate });
        } else {
          this.rows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate, Pago: row.paid });
        }
      });
    }

    if(tableData.cardTableDataList) {
      tableData.cardTableDataList.forEach((row) => {
        this.cardRows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Descricao: row.billDescription, Data: row.billDate });
      });
    }

    this.syncCardAndMainTableExpenses();
    this.setStatusData();
    this.setTotals();

    this.cdRef.detectChanges();
  }

  async loadMainTableData(): Promise<void> {
    this.isLoading();
    this.rows = new MatTableDataSource<any>([]);
    this.incomeRows = new MatTableDataSource<any>([]);

    try {
      const result = await this.billService.loadMainTableData(this.formatData(this.billDate));
      result.mainTableDataList.forEach((row) => {
        if (row.billType === 'Caixa' || row.billType === 'Ativo' || row.billType === 'Poupança') {
          this.incomeRows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate });
        } else {
          this.rows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate, Pago: row.paid });
        }
      });
      this.cdRef.detectChanges();
    } catch (error) {
      this.rows.data.push({ Nome: 'No data', Valor: 'R$ 0,00', Tipo: 'No data', Descricao: 'No data', Data: '' });
      this.dialogMessage.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
    } finally {
      this.isLoading();
    }

    this.rows.data = [...this.rows.data];
    this.incomeRows.data = [...this.incomeRows.data];
  }

  async loadCardTableData(): Promise<void> {
    this.isLoading();
    this.cardRows = new MatTableDataSource<any>([]);

    try {
      const result = await this.billService.loadCardTableData(this.formatData(this.billDate));
      result.cardTableDataList.forEach((row) => {
        this.cardRows.data.push({ id: row.id, Nome: row.billName, Valor: 'R$ ' + row.billValue, Descricao: row.billDescription, Data: row.billDate });
      });
      this.cdRef.detectChanges();
    } catch (error) {
      this.cardRows.data.push({ id: null, Nome: 'No data', Valor: 'R$ 0,00', Descricao: 'No data', Data: '' });
      this.dialogMessage.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
    } finally {
      this.isLoading();
    }

    this.cardRows.data = [...this.cardRows.data];
  }

  syncCardAndMainTableExpenses(): void {
    let creditCardTableAmount: number = 0;
    let isCardBillPresent: number = 0;
    let cardBillIndex: number = null;

    this.rows.data.forEach((row) => {
      if(row.Nome == 'Cartão de crédito') {
        isCardBillPresent += 1;
        cardBillIndex = this.rows.data.indexOf(row);
        row.Pago = localStorage.getItem("isCreditCardPaid") == "true";
      }
    });

    this.cardRows.data.forEach((row) => {
      creditCardTableAmount += parseFloat(row.Valor.replace('R$ ', ''));
    });

    if(isCardBillPresent == 0) {
      this.rows.data.push({ Nome: 'Cartão de crédito', Valor: 'R$ ' + creditCardTableAmount, Tipo: 'Passivo', Descricao: 'Soma da tabela de cartão de crédito', Data: this.formatData(this.billDate), Pago: localStorage.getItem("isCreditCardPaid") == "true" });
    } else {
      let updatedRow = this.rows.data[cardBillIndex];
      updatedRow.Valor = 'R$ ' + creditCardTableAmount;
    }

    this.rows.data = [...this.rows.data];
  }

  setStatusData(): void {
    this.totalPaid = this.rows.data.filter(row => row.Pago).reduce((acc, row) => acc + parseFloat(row.Valor.replace('R$ ', '')), 0);
    this.currentlyAvailableIncome = this.incomeRows.data.filter(incomeRow => (incomeRow.Tipo === 'Caixa' || incomeRow.Tipo === 'Ativo')).reduce((acc, incomeRow) => acc + parseFloat(incomeRow.Valor.replace('R$ ', '')), 0);
    this.setTotals();

    this.liquidStatus = this.currentlyAvailableIncome - this.totalPaid;
    this.liquidAndRightsStatus = this.getIncomeTotal() - this.totalDebit;
  }

  setTotals(): void {
    this.totalDebit = (this.rows.data.filter(row => row.Tipo === 'Passivo').reduce((acc, row) => acc + parseFloat(row.Valor.replace('R$ ', '')), 0)).toFixed(2);
    this.totalLeft = (this.totalDebit - this.totalPaid).toFixed(2);
  }

  formatNumberToIncrement(value: string):number {
    let valueWithoutSimbols: string = value.replace('R$', '');
    let valuewithoutSpaces: string = valueWithoutSimbols.replace(' ', '');
    let result: number = parseFloat(valuewithoutSpaces.replace(',', '.'));
    return result;
  }

  //marked for exclusion
  formatStatusBoxesContent(value: number) {
    if(value.toString().includes('.')){
      return value.toString().replace('.', ',');
    } else {
      return value;
    }
  }

  deleteItemFromMainTable(item): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "Sim") {
        this.isLoading();
        this.billService.deleteItemFromMainTable(item.id).then((result) => {
            this.dialogMessage.openInfoDialog(result.message);

            if (item.Tipo == "Passivo") {
              this.rows.data = this.rows.data.filter(
                (row) => row.id !== item.id
              );
            } else {
              this.incomeRows.data = this.incomeRows.data.filter(
                (incomeRow) => incomeRow.id !== item.id
              );
            }

            this.refreshTablesAndStatus(this.rows);
            this.isLoading();
          })
          .catch((error) => {
            this.dialogMessage.openErrorDialog("Falha: " + error);
            this.isLoading();
          });
      } else {

      }
    });
  }
  
  deleteItemFromCardTable(item): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Sim') {
        this.isLoading();
        this.billService
          .deleteItemFromCardTable(item.id)
          .then((result) => {
            this.dialogMessage.openInfoDialog(result.message);

            this.cardRows.data = this.cardRows.data.filter(
              (row) => row.id !== item.id
            );

            this.refreshTablesAndStatus(this.cardRows);
            this.isLoading();
          })
          .catch((error) => {
            this.dialogMessage.openErrorDialog("Falha: " + error);
            this.isLoading();
          });
      } else {

      }
    });
  }

  openMainTableEditDialog(item) {
    const dialogRef = this.dialog.open(EditTableDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'salvar') {
        this.editItemFromMainTable(item);
      } else {

      }
    });
  }

  openCardTableEditDialog(item) {
    const dialogRef = this.dialog.open(EditTableDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'salvar') {
        this.editItemFromCardTable(item);
      } else {

      }
    });
  }

  editItemFromMainTable(item) {
    this.isLoading();
    const billUpdate: BillRegisterRequest = {
      id: item.id,
      billName: item.Nome,
      billValue: this.formatNumberToIncrement(item.Valor),
      billDescription: item.Descricao,
      billType: item.Tipo,
      billTable: 'main',
      billDate: item.Data,
      isRecurrent: false,
      paid: item.Pago
    }
    this.billService.editItemFromMainTable(billUpdate).then(result => {
      //this.openInfoDialog(result.message);
      this.refreshTablesAndStatus(this.rows);
      this.dialogMessage.openInfoDialog('Item salvo');
      this.isLoading();
    }).catch(error => {
      this.dialogMessage.openErrorDialog('Falha ao sincronizar: '+error);
      this.isLoading();
    });
  }

  editItemFromCardTable(item) {
    this.isLoading();
    const billUpdate: BillRegisterRequest = {
      id: item.id,
      billName: item.Nome,
      billValue: this.formatNumberToIncrement(item.Valor),
      billDescription: item.Descricao,
      billType: null,
      billTable: 'card',
      billDate: item.Data,
      isRecurrent: false,
      paid: null
    }
    this.billService.editItemFromCardTable(billUpdate).then(result => {
      this.dialogMessage.openInfoDialog(result.message);
      this.refreshTablesAndStatus(this.cardRows);
      this.dialogMessage.openInfoDialog('Item salvo');
      this.isLoading();
    }).catch(error => {
      this.dialogMessage.openErrorDialog('Falha: '+error);
      this.isLoading();
    });
  }

  markAsPaid(item) {
    item.Nome != 'Cartão de crédito' ? this.editItemFromMainTable(item) : localStorage.setItem("isCreditCardPaid", item.Pago);
    this.setTotals();
  }

  async generateAiAdvice(analysisTypeId: number, startingDate: Date, temperature: number, finishDate: Date): Promise<void> {
    const [rowsTableString, cardRowsTableString, incomeRowsTableString] = await Promise.all([
      this.getMainTableFromAnalysisTypeAndStartingDate(analysisTypeId, startingDate),
      this.getCardTableFromAnalysisTypeAndStartingDate(analysisTypeId, startingDate),
      this.getIncomeTableFromAnalysisTypeAndStartingDate(analysisTypeId, startingDate)
    ]);

    const aiAdviceRequest: AiAdviceRequest = {
      mainAndIncomeTable: `${rowsTableString}\n\n${incomeRowsTableString}\n\n`,
      cardTable: `${cardRowsTableString}\n\n`,
      date: this.formatData(new Date()),
      analysisTypeId: analysisTypeId,
      temperature: temperature,
      startDate: this.toLocalISOString(startingDate),
      finishDate: this.toLocalISOString(finishDate)
    };

    await this.generateAiAdviceCall(aiAdviceRequest);
  }

  toLocalISOString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60000);
    return adjustedDate.toISOString().slice(0, -1);
  }

  generateAiAdviceCall(aiAdviceRequest: AiAdviceRequest): void {
    this.isLoading();
    this.billService.generateAiAdvice(aiAdviceRequest).then(result => {
      this.router.navigate(['fs/ai-analysis-detail', result.id]);
    }).catch(error => {
      this.dialogMessage.openErrorDialog(error.error.message);
    })
    .finally(() => {
      this.isLoading();
    })
  }

  async getMainTableFromAnalysisTypeAndStartingDate(analysisTypeId: number, startingDate: Date): Promise<string> {
    const analysisTypeChosen = this.analysisTypes.find(type => type.analysisTypeId === analysisTypeId);
    let stringBuilder = new StringBuilder();

    for(let i=0; i<analysisTypeChosen.period; i++) {
      this.billDate = this.addMonths(startingDate, i);
      await this.setTableData();
      stringBuilder.append("\n\n\n\nDados dessa tabela são referentes ao mês e ano: ")
      .append(`${this.formatData(this.billDate)} \n\n`)
      .append(this.generateTableString(this.rows.data));
    }

    return stringBuilder.toString();
  }

  async getIncomeTableFromAnalysisTypeAndStartingDate(analysisTypeId: number, startingDate: Date): Promise<string> {
    const analysisTypeChosen = this.analysisTypes.find(type => type.analysisTypeId === analysisTypeId);
    let stringBuilder = new StringBuilder();

    for(let i=0; i<analysisTypeChosen.period; i++) {
      this.billDate = this.addMonths(startingDate, i);
      await this.setTableData();
      stringBuilder.append("\n\n\n\nDados dessa tabela são referentes ao mês e ano: ")
      .append(`${this.billDate.getMonth()}/${this.billDate.getFullYear()} \n\n`)
      .append(this.generateTableString(this.incomeRows.data));
    }

    return stringBuilder.toString();
  }

  async getCardTableFromAnalysisTypeAndStartingDate(analysisTypeId: number, startingDate: Date): Promise<string> {
    const analysisTypeChosen = this.analysisTypes.find(type => type.analysisTypeId === analysisTypeId);
    let stringBuilder = new StringBuilder();

    for(let i=0; i<analysisTypeChosen.period; i++) {
      this.billDate = this.addMonths(startingDate, i);
      await this.setTableData();
      stringBuilder.append("\n\n\n\nDados dessa tabela são referentes ao mês e ano: ")
      .append(`${this.billDate.getMonth()}/${this.billDate.getFullYear()} \n\n`)
      .append(this.generateTableString(this.cardRows.data));
    }

    return stringBuilder.toString();
  }

  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  generateTableString(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }
  
    const headers = Object.keys(data[0]);
  
    // Gera a string com os valores da tabela, sem as tags HTML
    const valuesString = data.map(item => headers.map(header => item[header]).join('\t')).join('\n');
  
    return valuesString;
  }

  getIncomeTotal(): number {
    let result: number = this.incomeRows.data.reduce((acc, incomeRow) => acc + parseFloat(incomeRow.Valor.replace('R$ ', '')), 0);
    return result;
  }

}