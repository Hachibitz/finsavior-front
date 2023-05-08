import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';
import { TipoConta, SelectedMonth } from 'src/app/model/main.model';
//declare var $: any;

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
  tipoConta: string = '';
  tiposConta: TipoConta[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Passivo', value: 'passivo' },
    { label: 'Caixa', value: 'caixa' }
  ];

  months: SelectedMonth[] = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' }
  ];

  tabs = [
    { titulo: 'Aba 1', conteudo: 'Conteúdo da aba 1' },
    { titulo: 'Aba 2', conteudo: 'Conteúdo da aba 2' },
    { titulo: 'Aba 3', conteudo: 'Conteúdo da aba 3' }
  ];
  currentTab = this.tabs[0];

  items: MenuItem[];

  constructor(config: NgbDropdownConfig) {
    this.items = [
      { icon: 'pi pi-user', label: 'Perfil' },
      { separator: true },
      { icon: 'pi pi-cog', label: 'Configurações' },
      { icon: 'pi pi-sign-out', label: 'Sair' },
    ];

    config.placement = 'top-right';
  }

  ngOnInit() {
    //$('.dropdown-toggle').dropdown();
  }

  selectTab(tab) {
    this.currentTab = tab;
  }

  addRegister() {
    console.log(this.tipoConta);
    switch (this.tipoConta) {
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
        this.selectedOption = this.months[0].label;
        break;
      case '2':
        this.selectedOption = this.months[1].label;
        break;
      case '3':
        this.selectedOption = this.months[2].label;
        break;
      default:
        console.log('Tipo de conta inválido');
        break;
    }
  }

}
