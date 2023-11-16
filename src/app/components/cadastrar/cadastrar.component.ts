import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignUpRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogMessagesComponent } from '../dialog-messages/dialog-messages.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit {

  darkMode: boolean = false;
  email: string;
  userName: string;
  name: string;
  lastname: string;
  password: string;
  termsAcceptance: boolean;
  signUpRequest: SignUpRequest

  constructor(private themeService: ThemeService, private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  register() {
    this.signUpRequest = {
      email: this.email,
      username: this.userName,
      firstName: this.name,
      lastName: this.lastname,
      password: this.password
    }

    this.authService.signUp(this.signUpRequest).then((result)=>{
      this.redirectToLogin();
      this.openInfoDialog('Cadastro realizado com sucesso!');
    }).catch(error => {
      this.openErrorDialog('Erro no cadastro: '+error);
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

  redirectToLogin(): void {
    this.router.navigate(['fs/login']);
  }

}
