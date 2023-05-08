import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

const animacaoAba = trigger('animacaoAba', [
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
  animations: [animacaoAba]
})
export class MainComponent implements OnInit {

  months: string[] = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  abas = [
    { titulo: 'Aba 1', conteudo: 'Conteúdo da aba 1' },
    { titulo: 'Aba 2', conteudo: 'Conteúdo da aba 2' },
    { titulo: 'Aba 3', conteudo: 'Conteúdo da aba 3' }
  ];
  abaAtiva = this.abas[0];

  constructor(config: NgbDropdownConfig) { 
    config.placement = 'top-right';
  }

  ngOnInit() {
    $('.dropdown-toggle').dropdown();
  }

  selecionarAba(aba) {
    this.abaAtiva = aba;
  }

}
