import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  email: string;
  name: string;
  lastname: string;
  password: string;
  termsAcceptance: boolean;

  register() {
    // Lógica para cadastrar o usuário
  }

}
