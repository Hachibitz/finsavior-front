import { Component, OnInit } from '@angular/core';
import { SignUpRequest } from 'src/app/model/user.model';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private themeService: ThemeService, private userService: UserService) { }

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

    this.userService.signUp(this.signUpRequest);
  }

}
