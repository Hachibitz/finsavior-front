import { Component } from '@angular/core';
import { LoginRequest } from 'src/app/model/main.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-dropdown',
  templateUrl: './login-dropdown.component.html',
  styleUrls: ['./login-dropdown.component.scss']
})
export class LoginDropdownComponent {

  loginRequest: LoginRequest;
  username: string;
  password: string;

  constructor(private loginService: LoginService){
    
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
      password: this.password
    }

    console.log("loginRequest -> ", this.loginRequest);
    
    this.loginService.login(this.loginRequest).then((token) => {
      console.log(token);
    });
  }
}
