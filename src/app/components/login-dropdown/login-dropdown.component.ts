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
  username: string;
  password: string;
  rememberMe: boolean;
  isLoggedIn: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private dialogMessage: DialogMessage){
    
  }

  ngOnInit(): void {
    const token = this.authService.getToken();

    this.authService.validateToken(token).then(
      (isValid) => {
        this.isLoggedIn = isValid;
      })
      .catch((error) => {
        this.isLoggedIn = false;
      }
    );
  }

  userName: string = 'John Doe';
  userProfilePicture: string = 'https://tds-images.thedailystar.net/sites/default/files/styles/amp_metadata_content_image_min_696px_wide/public/images/2022/10/14/ai_art_generator.png';
  dropdownOpen: boolean = false;

  toggleDropdown(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;

    if (!this.dropdownOpen) {
      this.username = '';
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
}
