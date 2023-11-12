import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

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

  constructor(private themeService: ThemeService, private authService: AuthService, private router: Router) { }

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
    })
    .catch((error) => {
      this.isLoggedIn = false;
    })
  }

  redirectToRegistration(): void {
    this.router.navigate(['fs/cadastrar']);
  }

  redirectToMain(): void {
    this.router.navigate(['fs/main']);
  }
}
