import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { BillRegisterRequest, TipoConta } from 'src/app/model/main.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { ThemeService } from 'src/app/services/theme.service';
import { BillService } from 'src/app/services/bill.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
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
export class MainComponent implements OnInit {

  mainTableForm: FormGroup;
  cardTableForm: FormGroup;

  ColumnMode = ColumnMode;
  loading: boolean = false;
  darkMode:boolean = false;

  rows = [];
  cardRows = [];
  incomeRows = [];

  selectedType: string;
  
  billName: string = '';
  billValue: number;
  billDescription: string;
  billDate: Moment;
  cardBillName: string;
  cardBillValue: number;
  cardBillDescription: string;
  liquidStatus: number = 0;
  liquidAndRightsStatus: number = 0;
  income: number;
  totalDebit: number;
  totalLeft: number;

  tableTypes: string[] = [
    'main',
    'credit-card'
  ]

  billTypes: TipoConta[] = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Passivo', value: 'Passivo' },
    { label: 'Caixa', value: 'Caixa' }
  ];

  ngOnInit(): void {
    this.darkMode = this.themeService.checkDarkMode();
    const anoAtual = _moment().year();
    const mesAtual = _moment().month() + 1; // Os meses em Moment.js são indexados a partir de 0
    this.billDate = _moment(`${anoAtual}-${mesAtual}`, "YYYY-MM");

    this.setTableData();
  }

  constructor(private cdRef: ChangeDetectorRef, private themeService: ThemeService, private billService: BillService, private dialog: MatDialog, private fb: FormBuilder, private dialogMessage: DialogMessage) {
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

  async setTableData() {
    await this.loadMainTableData();
    await this.loadCardTableData();
    this.syncCardAndMainTableExpenses();
    this.setStatusData();
    this.setTotals();
  }

  onSelectDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.billDate = normalizedMonthAndYear.clone();
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

  formatData(date: Moment): string {
    const dateString = date.toString();
    const parts = dateString.split(' ');

    const month = parts[1];
    const year = parts[3];

    return month+' '+year;
  }

  loadMainTableData(): Promise<void> {
    this.isLoading();
    this.rows = [];
    this.incomeRows = [];
    this.income = 0;

    return new Promise((resolve, reject) => {
      this.billService.loadMainTableData(this.formatData(this.billDate)).then(result => {
        result.mainTableDataList.forEach((row) => {
          if(row.billType == 'Caixa' || row.billType == 'Ativo'){
            this.income += row.billValue;
            this.incomeRows.push({ id: row.id, Nome: row.billName, Valor: 'R$ '+row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate });
          } else {
            this.rows.push({ id: row.id, Nome: row.billName, Valor: 'R$ '+row.billValue, Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate, Pago: row.paid });
          }
        });
        this.cdRef.detectChanges();
        this.isLoading();
        resolve();
      })
      .catch(error => {
        this.rows.push({ Nome: 'No data', Valor: 'R$ 0,00', Tipo: 'No data', Descricao: 'No data', Data: '' });
        this.isLoading();
        this.dialogMessage.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
        reject();
      });
    });
  }

  async loadCardTableData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading();
      this.cardRows = [];
      this.billService.loadCardTableData(this.formatData(this.billDate)).then(result => {
        result.cardTableDataList.forEach((row) => {
          this.cardRows.push({ id: row.id, Nome: row.billName, Valor: 'R$ '+row.billValue, Descricao: row.billDescription, Data: row.billDate });
        });
        this.cdRef.detectChanges();
        this.isLoading();
        resolve();
      })
      .catch(error => {
        this.cardRows.push({ id: null, Nome: 'No data', Valor: 'R$ 0,00', Desc: 'No data', Data: '' });
        this.isLoading();
        this.dialogMessage.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
        reject();
      });
    });
  }

  syncCardAndMainTableExpenses(): void {
    let creditCardTableAmount: number = 0;
    let isCardBillPresent: number = 0;
    let cardBillIndex: number = null;

    this.rows.forEach((row) => {
      if(row.Nome == 'Cartão de crédito') {
        isCardBillPresent += 1;
        cardBillIndex = this.rows.indexOf(row);
        row.Pago = localStorage.getItem("isCreditCardPaid") == 'true' ? true : false;
      }
    })

    this.cardRows.forEach((cardRow) => {
      let index = this.cardRows.indexOf(cardRow);
      creditCardTableAmount += this.formatNumberToIncrement(this.cardRows[index].Valor);
    })


    if(isCardBillPresent >= 1) {
      this.rows[cardBillIndex].Valor = 'R$ '+creditCardTableAmount.toFixed(2);
      const indexOfCreditCardBill = this.rows.indexOf(this.rows[cardBillIndex]);
      const creditBillInArray = this.rows.splice(indexOfCreditCardBill, 1);
      this.rows.unshift(creditBillInArray[0]);
      this.cdRef.detectChanges();
      /*let mainTableCreditCardValue = this.formatNumberToIncrement(this.rows[cardBillIndex].Valor);

      if(creditCardTableAmount >= mainTableCreditCardValue){
        this.rows[cardBillIndex].Valor = 'R$ '+creditCardTableAmount.toFixed(2);
      } else {
        this.cardRows.push({ Nome: 'Outros gastos', Valor: 'R$'+(mainTableCreditCardValue-creditCardTableAmount).toFixed(2), Descricao: 'Gastos desconhecidos com cartão de crédito', Data: this.formatData(this.billDate) });
      }*/
    } else {
      let creditCardBill = { Nome: 'Cartão de crédito', Valor: 'R$ '+creditCardTableAmount.toFixed(2), Tipo: 'Passivo', Descricao: 'Detalhamento disponível na tabela de cartão', Data: this.formatData(this.billDate), Pago: localStorage.getItem("isCreditCardPaid") == 'true' ? true : false };
      this.rows.push(creditCardBill);
      const indexOfCreditCardBill = this.rows.indexOf(creditCardBill);
      const creditBillInArray = this.rows.splice(indexOfCreditCardBill, 1);
      this.rows.unshift(creditBillInArray[0]);
      this.cdRef.detectChanges();
    }
  }

  setStatusData() {
    this.liquidStatus = 0;
    this.liquidAndRightsStatus = 0;
    this.rows.forEach((row) => {
      switch(row.Tipo) {
        /*case 'Ativo':
          this.liquidAndRightsStatus += this.formatNumberToIncrement(row.Valor);
          break;*/
        case 'Passivo':
          this.liquidStatus -= this.formatNumberToIncrement(row.Valor);
          this.liquidAndRightsStatus -= this.formatNumberToIncrement(row.Valor);
          break;
        /*case 'Caixa':
          this.liquidStatus += this.formatNumberToIncrement(row.Valor);
          this.liquidAndRightsStatus += this.formatNumberToIncrement(row.Valor);
          break;*/
        default:
          break;
      }
    })

    this.incomeRows.forEach((incomeRow)=>{
      incomeRow.Tipo == 'Caixa' ? this.liquidStatus += this.formatNumberToIncrement(incomeRow.Valor) : false;
    })
    this.liquidStatus = parseFloat(this.liquidStatus.toFixed(2))
    this.liquidAndRightsStatus = parseFloat(this.liquidAndRightsStatus.toFixed(2))+this.income;
  }

  setTotals(): void {
    let totalToDeduct: number = 0;
    this.totalDebit = 0;
    this.totalLeft = 0;
    
    this.rows.forEach((row => {
      row.Tipo == 'Passivo' ? this.totalDebit += this.formatNumberToIncrement(row.Valor) : false;
      row.Pago ? totalToDeduct += this.formatNumberToIncrement(row.Valor) : false;
    }))
    this.totalLeft = this.totalDebit - totalToDeduct;
    this.totalDebit = parseFloat(this.totalDebit.toFixed(2));
    this.totalLeft = parseFloat(this.totalLeft.toFixed(2));
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

  deleteItemFromMainTable(item) {
    this.isLoading();
    this.billService.deleteItemFromMainTable(item.id).then(result => {
      this.dialogMessage.openInfoDialog(result.message);
      let index = this.rows.indexOf(item);
      this.rows.splice(index, 1);
      this.syncCardAndMainTableExpenses();
      this.setStatusData();
      this.setTotals();
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.dialogMessage.openErrorDialog('Falha: '+error);
      this.isLoading();
    });
  }

  deleteItemFromCardTable(item) {
    this.isLoading();
    this.billService.deleteItemFromCardTable(item.id).then(result => {
      this.dialogMessage.openInfoDialog(result.message);
      let index = this.cardRows.indexOf(item);
      this.cardRows.splice(index, 1);
      this.syncCardAndMainTableExpenses();
      this.setStatusData();
      this.setTotals();
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.dialogMessage.openErrorDialog('Falha: '+error);
      this.isLoading();
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
      this.syncCardAndMainTableExpenses();
      this.setStatusData();
      this.setTotals();
      this.cdRef.detectChanges();
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
      this.syncCardAndMainTableExpenses();
      this.setStatusData();
      this.setTotals();
      this.cdRef.detectChanges();
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

}
