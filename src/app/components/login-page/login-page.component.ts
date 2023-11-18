import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';

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
  rememberMe: boolean;
  darkMode: boolean = false;

  constructor(private themeService: ThemeService, private authService: AuthService, private router: Router, private dialogMessage: DialogMessage) { }

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  login(): void {
    this.loginRequest = {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    }
    
    this.authService.login(this.loginRequest).then((response) => {
      this.isLoggedIn = true;
      this.redirectToMain();
      this.dialogMessage.openInfoDialog('Login realizado com sucesso!');
    })
    .catch((error) => {
      this.isLoggedIn = false;
      this.dialogMessage.openErrorDialog('Erro no login: '+error);
    })
  }

  redirectToRegistration(): void {
    this.router.navigate(['fs/cadastrar']);
  }

  redirectToMain(): void {
    this.router.navigate(['fs/main']);
  }
}
