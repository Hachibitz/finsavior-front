import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { SaveRequest, TipoConta } from 'src/app/model/main.model';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { ThemeService } from 'src/app/services/theme.service';
import { MainService } from 'src/app/services/main.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

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
    { Nome: 'Conta 1', Valor: 'R$ 20.000,00', Tipo: 'Ativo', Comentario: 'DescTeste 1', Data: '' },
    { Nome: 'Conta 2', Valor: 'R$ 20.000,00', Tipo: 'Passivo', Comentario: 'DescTeste 2', Data: '' },
    { Nome: 'Conta 3', Valor: 'R$ 20.000,00', Tipo: 'Caixa', Comentario: 'DescTeste 3', Data: '' }
  ];

  cardRows = [
    { Nome: 'Conta 1', Valor: 'R$ 20.000,00'},
    { Nome: 'Conta 2', Valor: 'R$ 20.000,00'},
    { Nome: 'Conta 3', Valor: 'R$ 20.000,00'}
  ];

  selectedType: string;
  
  billName: string = '';
  billValue: number;
  billDescription: string;
  billDate: Moment;
  cardBillName: string;
  cardBillValue: number;

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
  }

  constructor(private cdRef: ChangeDetectorRef, 
              private headerBarComponent: HeaderBarComponent, 
              private themeService: ThemeService,
              private mainService: MainService) {

  }

  onSelectDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.billDate = normalizedMonthAndYear.clone();
    datepicker.close();
  }

  toggleDarkMode() {
    let darkModeSessionSet: string = this.darkMode == true ? 'true' : 'false';
    sessionStorage.setItem('dark-mode', darkModeSessionSet);
    console.log(sessionStorage.getItem('dark-mode'));
    const body = document.getElementById('mainBody');
    body.classList.toggle('dark-mode', this.darkMode);
    this.headerBarComponent.toggleDarkMode();
  }

  addRegisterMain() {  
    /*this.isLoading();
    of('Após 2 segundos').pipe(delay(2000)).subscribe(result => {
      this.isLoading();
    });*/
    this.rows.push({ Nome: this.billName, Valor: 'R$ '+this.billValue, Tipo: this.selectedType, Comentario: this.billDescription, Data: this.formatData(this.billDate) });
    this.cdRef.detectChanges();

    let saveRequest: SaveRequest = {
      billDate: this.formatData(this.billDate),
      billType: this.selectedType,
      billName: this.billName,
      billValue: this.billValue,
      billDesc: this.billDescription
    };

    this.isLoading();
    this.mainService.billRegister(saveRequest)
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
    console.log(this.selectedType);
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

}
