import { Component, OnInit } from '@angular/core';
import { SignUpRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

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

  constructor(private themeService: ThemeService, private authService: AuthService) { }

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

    this.authService.signUp(this.signUpRequest);
  }

}
