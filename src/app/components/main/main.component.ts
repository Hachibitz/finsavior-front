import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { TipoConta, SelectedMonth } from 'src/app/model/main.model';

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
  providers: [NgbDropdownConfig],
  animations: [tabAnimation]
})
export class MainComponent implements OnInit {

  selectedOption: string;
  selectedMonth: string;
  
  nomeConta: string = '';

  tiposConta: TipoConta[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Passivo', value: 'passivo' },
    { label: 'Caixa', value: 'caixa' }
  ];

  months: SelectedMonth[] = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Maio', value: '5' },
    { label: 'Junho', value: '6' },
    { label: 'Julho', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Setembro', value: '9' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' }
  ];

  ngOnInit() {

  }

  addRegister() {
    //todo
  }

  selectRegisterType() {
    console.log(this.selectedOption);
    switch (this.selectedOption) {
      case 'ativo':
        this.selectedOption = this.tiposConta[0].label;
        break;
      case 'passivo':
        this.selectedOption = this.tiposConta[1].label;
        break;
      case 'caixa':
        this.selectedOption = this.tiposConta[2].label;
        break;
      default:
        console.log('Tipo de conta inválido');
        break;
    }
  }

  selectMonth() {
    console.log(this.selectedMonth);
    switch (this.selectedMonth) {
      case '1':
        this.selectedMonth = this.months[0].label;
        break;
      case '2':
        this.selectedMonth = this.months[1].label;
        break;
      case '3':
        this.selectedMonth = this.months[2].label;
        break;
      default:
        console.log('Tipo de conta inválido');
        break;
    }
  }

}
