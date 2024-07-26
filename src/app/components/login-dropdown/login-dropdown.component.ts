import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-dropdown',
  templateUrl: './login-dropdown.component.html',
  styleUrls: ['./login-dropdown.component.scss']
})
export class LoginDropdownComponent implements OnInit{

  loginRequest: LoginRequest;
  userLogin: string;
  password: string;
  rememberMe: boolean;
  isLoggedIn: boolean = false;

  userName: string;
  userProfilePicture;
  dropdownOpen: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private dialogMessage: DialogMessage){

  }

  ngOnInit(): void {
    const token = this.authService.getToken();

    this.authService.validateToken(token).then(
      (isValid) => {
        this.isLoggedIn = isValid;

        if (isValid) {
          this.loadUserProfile();
        }
      })
      .catch((error) => {
        this.isLoggedIn = false;
      }
    );
  }

  loadUserProfile() {
    this.userService.getProfileData().then(result => {
        this.userProfilePicture = 'data:image/png;base64,' + result.profilePicture;
        this.userName = result.username;
    })
    .catch(error => {
        this.dialogMessage.openErrorDialog('Erro ao carregar perfil do usuário: ' + error.error);
    });
  }

  toggleDropdown(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;

    if (!this.dropdownOpen) {
      this.userLogin = '';
      this.password = '';
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  preventClose(event: Event): void {
    event.preventDefault();
  }

  login(): void {
    this.loginRequest = {
      userLogin: this.userLogin,
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['fs/login']);
  }

  redirectToRegistration(): void {
    this.router.navigate(['fs/cadastrar']);
  }

  redirectToMain(): void {
    this.router.navigate(['fs/main']);
  }

  redirectToMyAccount(): void {
    this.router.navigate(['fs/account']);
  }

  redirectToForgottenPassword(): void {
    this.router.navigate(['fs/forgotten-password']);
  }
}
