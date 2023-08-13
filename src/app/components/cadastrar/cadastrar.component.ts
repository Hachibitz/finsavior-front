import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit {

  darkMode: boolean = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
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
