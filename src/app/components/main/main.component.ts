import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { TipoConta, SelectedMonth } from 'src/app/model/main.model';
import { ColumnMode } from '@swimlane/ngx-datatable';

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

  ColumnMode = ColumnMode;

  rows = [
    { Nome: 'R$ 10.000,00', Valor: 'R$ 20.000,00', Tipo: 'R$ 5.000,00', Comentario: 'DescTeste' },
    { Nome: 'R$ 10.000,00', Valor: 'R$ 20.000,00', Tipo: 'R$ 5.000,00', Comentario: 'DescTeste' },
    { Nome: 'R$ 10.000,00', Valor: 'R$ 20.000,00', Tipo: 'R$ 5.000,00', Comentario: 'DescTeste' }
  ];

  selectedType: string;
  selectedMonth: string;
  
  nomeConta: string = '';
  valorConta: number;
  descricaoConta: string;

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

  constructor(private cdRef: ChangeDetectorRef) {

  }

  addRegister() {  
    this.rows.push({ Nome: this.nomeConta, Valor: 'R$ '+this.valorConta, Tipo: this.selectedType, Comentario: this.descricaoConta });
    this.cdRef.detectChanges();
  }

  selectRegisterType() {
    console.log(this.selectedType);
  }

  selectMonth() {
    console.log(this.selectedMonth);
  }

}
