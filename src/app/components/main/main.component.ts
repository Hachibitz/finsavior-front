import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { BillRegisterRequest, TipoConta } from 'src/app/model/main.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { ThemeService } from 'src/app/services/theme.service';
import { BillService } from 'src/app/services/bill.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessagesComponent } from '../dialog-messages/dialog-messages.component';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';

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

  ColumnMode = ColumnMode;
  loading: boolean = false;
  darkMode:boolean = false;

  rows = [];

  cardRows = [];

  selectedType: string;
  
  billName: string = '';
  billValue: number;
  billDescription: string;
  billDate: Moment;
  cardBillName: string;
  cardBillValue: number;
  cardBillDesc: string;
  liquidStatus: number = 0;
  liquidAndRightsStatus: number = 0;

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

    this.loadMainTableData();
    this.loadCardTableData();
  }

  constructor(private cdRef: ChangeDetectorRef, 
              private headerBarComponent: HeaderBarComponent, 
              private themeService: ThemeService,
              private billService: BillService,
              private dialog: MatDialog) {

  }

  onSelectDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.billDate = normalizedMonthAndYear.clone();
    this.loadMainTableData();
    this.loadCardTableData();
    datepicker.close();
  }

  toggleDarkMode() {
    /*this.darkMode = sessionStorage.getItem('dark-mode') == 'true' ? true : false;
    const mainBody = document.getElementById('mainBody');
    headerBar.classList.toggle('dark-mode', this.darkMode);*/
  }

  addRegisterMain() {
    let billRegisterRequest: BillRegisterRequest = {
      id: null,
      billDate: this.formatData(this.billDate),
      billType: this.selectedType,
      billName: this.billName,
      billValue: this.billValue,
      billDescription: this.billDescription,
      billTable: this.tableTypes[0]
    };

    this.isLoading();
    this.billService.billRegister(billRegisterRequest)
      .then(result => {
        this.rows.push({ Nome: this.billName, Valor: 'R$ '+this.billValue, Tipo: this.selectedType, Descricao: this.billDescription, Data: this.formatData(this.billDate) });
        this.setStatusData();
        this.cdRef.detectChanges();
        this.isLoading();
      })
      .catch(error => {
        this.openErrorDialog('Falha ao inserir registro, tente novamente mais tarde.');
        this.isLoading();
      });
  }

  addRegisterCard() {
    let billRegisterRequest: BillRegisterRequest = {
      id: null,
      billDate: this.formatData(this.billDate),
      billType: null,
      billName: this.cardBillName,
      billValue: this.cardBillValue,
      billDescription: this.cardBillDesc,
      billTable: this.tableTypes[1]
    };

    this.isLoading();
    this.billService.billRegister(billRegisterRequest)
      .then(result => {
        this.cardRows.push({ Nome: this.cardBillName, Valor: 'R$ '+this.cardBillValue, Desc: this.cardBillDesc, Data: this.formatData(this.billDate) });
        this.setStatusData();
        this.cdRef.detectChanges();
        this.isLoading();
      })
      .catch(error => {
        this.openErrorDialog('Falha ao inserir registro, tente novamente mais tarde.');
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

  loadMainTableData() {
    this.isLoading();
    this.rows = [];
    this.billService.loadMainTableData(this.formatData(this.billDate)).then(result => {
      result.mainTableDataList.forEach((row) => {
        this.rows.push({ id: row.id, Nome: row.billName, Valor: 'R$ '+row.billValue+',00', Tipo: row.billType, Descricao: row.billDescription, Data: row.billDate });
      });
      this.cdRef.detectChanges();
      this.setStatusData();
      this.isLoading();
    })
    .catch(error => {
      this.rows.push({ Nome: 'No data', Valor: 'R$ 0,00', Tipo: 'No data', Descricao: 'No data', Data: '' });
      this.isLoading();
      this.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
    });
  }

  loadCardTableData() {
    this.isLoading();
    this.cardRows = [];
    this.billService.loadCardTableData(this.formatData(this.billDate)).then(result => {
      result.cardTableDataList.forEach((row) => {
        this.cardRows.push({ id: row.id, Nome: row.billName, Valor: 'R$ '+row.billValue+',00', Desc: row.billDescription, Data: row.billDate });
      });
      this.cdRef.detectChanges();
      this.setStatusData();
      this.isLoading();
    })
    .catch(error => {
      this.cardRows.push({ id: null, Nome: 'No data', Valor: 'R$ 0,00', Desc: 'No data', Data: '' });
      this.isLoading();
      this.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
    });
  }

  setStatusData() {
    this.rows.forEach((row) => {
      switch(row.Tipo) {
        case 'Ativo':
          this.liquidAndRightsStatus += this.formatNumberToIncrementStatus(row.Valor);
          break;
        case 'Passivo':
          this.liquidStatus -= this.formatNumberToIncrementStatus(row.Valor);
          this.liquidAndRightsStatus -= this.formatNumberToIncrementStatus(row.Valor);
          break;
        case 'Caixa':
          this.liquidStatus += this.formatNumberToIncrementStatus(row.Valor);
          this.liquidAndRightsStatus += this.formatNumberToIncrementStatus(row.Valor);
          break;
        default:
          break;
      }
    })
  }

  formatNumberToIncrementStatus(value: string):number {
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

  openErrorDialog(errorMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: errorMessage, 
              name: "Erro",
              messageType: "error"
            },
    });
    of('Após 5 segundos').pipe(delay(5000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

  openInfoDialog(infoMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: infoMessage, 
              name: "Success",
              messageType: "info"
            },
    });
    of('Após 2 segundos').pipe(delay(2000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

  deleteItemFromMainTable(item) {
    this.isLoading();
    this.billService.deleteItemFromMainTable(item.id).then(result => {
      this.openInfoDialog(result.message);
      let index = this.rows.indexOf(item);
      this.rows.splice(index, 1);
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.openErrorDialog('Falha: '+error);
      this.isLoading();
    });
  }

  deleteItemFromCardTable(item) {
    this.isLoading();
    this.billService.deleteItemFromCardTable(item.id).then(result => {
      this.openInfoDialog(result.message);
      let index = this.cardRows.indexOf(item);
      this.cardRows.splice(index, 1);
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.openErrorDialog('Falha: '+error);
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
      billValue: this.formatNumberToIncrementStatus(item.Valor),
      billDescription: item.Descricao,
      billType: item.Tipo,
      billTable: 'main',
      billDate: item.Data
    }
    this.billService.editItemFromMainTable(billUpdate).then(result => {
      this.openInfoDialog(result.message);
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.openErrorDialog('Falha: '+error);
      this.isLoading();
    });
  }

  editItemFromCardTable(item) {
    this.isLoading();
    const billUpdate: BillRegisterRequest = {
      id: item.id,
      billName: item.Nome,
      billValue: this.formatNumberToIncrementStatus(item.Valor),
      billDescription: item.Descricao,
      billType: null,
      billTable: 'card',
      billDate: item.Data
    }
    this.billService.editItemFromCardTable(billUpdate).then(result => {
      this.openInfoDialog(result.message);
      this.cdRef.detectChanges();
      this.isLoading();
    }).catch(error => {
      this.openErrorDialog('Falha: '+error);
      this.isLoading();
    });
  }

}
