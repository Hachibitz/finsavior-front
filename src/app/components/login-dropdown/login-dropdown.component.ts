import { Component } from '@angular/core';

@Component({
  selector: 'app-login-dropdown',
  templateUrl: './login-dropdown.component.html',
  styleUrls: ['./login-dropdown.component.scss']
})
export class LoginDropdownComponent {
  userName: string = 'John Doe';
  userProfilePicture: string = 'https://tds-images.thedailystar.net/sites/default/files/styles/amp_metadata_content_image_min_696px_wide/public/images/2022/10/14/ai_art_generator.png';
  dropdownOpen: boolean = false;

  toggleDropdown(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  
  preventClose(event: Event): void {
    event.preventDefault();
  }  

  closeDropdown(event: MouseEvent) {
    this.dropdownOpen = false;
  }
}
