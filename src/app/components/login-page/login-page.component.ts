import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogMessagesComponent } from '../dialog-messages/dialog-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{
  loginRequest: LoginRequest;
  username: string;
  password: string;
  isLoggedIn: boolean = false;
  termsAcceptance: boolean;
  keepConnected: boolean;
  darkMode: boolean = false;

  constructor(private themeService: ThemeService, private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  login(): void {
    this.loginRequest = {
      username: this.username,
      password: this.password
    }
    
    this.authService.login(this.loginRequest).then((response) => {
      this.isLoggedIn = true;
      this.redirectToMain();
      this.openInfoDialog('Login realizado com sucesso!');
    })
    .catch((error) => {
      this.isLoggedIn = false;
      this.openErrorDialog('Erro no login: '+error);
    })
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

  redirectToRegistration(): void {
    this.router.navigate(['fs/cadastrar']);
  }

  redirectToMain(): void {
    this.router.navigate(['fs/main']);
  }
}
