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
export class LoginPageComponent implements OnInit {
  loginRequest: LoginRequest;
  username: string;
  password: string;
  rememberMe: boolean;
  darkMode: boolean = false;
  loading: boolean = false;

  constructor(
    private themeService: ThemeService, 
    private authService: AuthService, 
    private router: Router, 
    private dialogMessage: DialogMessage
  ) { }

  async ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
    const isAuthenticated = await this.authService.isAuthenticated();

    if(isAuthenticated) {
      this.router.navigate(['fs/main']);
    }
  }

  login(): void {
    this.loading = true;
    this.loginRequest = {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    }
    
    this.authService.login(this.loginRequest).then((response) => {
      this.loading = false;
      this.dialogMessage.openInfoDialog('Login realizado com sucesso!');
      this.router.navigate(['fs/main']);
    }).catch((error) => {
      this.loading = false;
      this.dialogMessage.openErrorDialog('Erro no login: ' + error.message);
    })
  }

  redirectToRegistration(): void {
    this.router.navigate(['fs/cadastrar']);
  }

  redirectToForgottenPassword(): void {
    this.router.navigate(['fs/forgotten-password']);
  }
}
