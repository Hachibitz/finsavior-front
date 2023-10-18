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

  rows = [
    { Nome: 'Conta 1', Valor: 'R$ 2000,25', Tipo: 'Ativo', Comentario: 'DescTeste 1', Data: '' },
    { Nome: 'Conta 2', Valor: 'R$ 20000,32', Tipo: 'Passivo', Comentario: 'DescTeste 2', Data: '' },
    { Nome: 'Conta 3', Valor: 'R$ 300000,50', Tipo: 'Caixa', Comentario: 'DescTeste 3', Data: '' }
  ];

  cardRows = [
    { Nome: 'Conta 1', Valor: 'R$ 20000,00'},
    { Nome: 'Conta 2', Valor: 'R$ 20000,00'},
    { Nome: 'Conta 3', Valor: 'R$ 20000,00'}
  ];

  selectedType: string;
  
  billName: string = '';
  billValue: number;
  billDescription: string;
  billDate: Moment;
  cardBillName: string;
  cardBillValue: number;
  liquidStatus: number = 0;
  liquidAndRightsStatus: number = 0;

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
  }

  constructor(private cdRef: ChangeDetectorRef, 
              private headerBarComponent: HeaderBarComponent, 
              private themeService: ThemeService,
              private billService: BillService,
              private dialog: MatDialog) {

  }

  onSelectDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.billDate = normalizedMonthAndYear.clone();
    datepicker.close();
  }

  toggleDarkMode() {
    /*this.darkMode = sessionStorage.getItem('dark-mode') == 'true' ? true : false;
    const mainBody = document.getElementById('mainBody');
    headerBar.classList.toggle('dark-mode', this.darkMode);*/
  }

  addRegisterMain() {  
    /*this.isLoading();
    of('Após 2 segundos').pipe(delay(2000)).subscribe(result => {
      this.isLoading();
    });*/
    this.rows.push({ Nome: this.billName, Valor: 'R$ '+this.billValue, Tipo: this.selectedType, Comentario: this.billDescription, Data: this.formatData(this.billDate) });
    this.cdRef.detectChanges();

    let billRegisterRequest: BillRegisterRequest = {
      billDate: this.formatData(this.billDate),
      billType: this.selectedType,
      billName: this.billName,
      billValue: this.billValue,
      billDescription: this.billDescription,
      billTable: ''
    };

    this.isLoading();
    this.billService.billRegister(billRegisterRequest)
      .then(result => {
        this.isLoading();
      })
      .catch(error => {
        this.isLoading();
      });
  }

  addRegisterCard() {
    this.cardRows.push({ Nome: this.cardBillName, Valor: 'R$ '+this.cardBillValue });
    this.cdRef.detectChanges();
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
    this.billService.loadMainTableData().then(result => {
      result.mainTableDataList.forEach((row) => {
        this.rows.push({ Nome: row.billName, Valor: 'R$ '+row.billValue+',00', Tipo: row.billType, Comentario: row.billDescription, Data: row.billDate });
      });
      this.cdRef.detectChanges();
      this.setStatusData();
      this.isLoading();
    })
    .catch(error => {
      this.isLoading();
      this.openErrorDialog('Ocorreu um erro na comunicação com o servidor.');
    });;
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
    of('Após 10 segundos').pipe(delay(10000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

}
