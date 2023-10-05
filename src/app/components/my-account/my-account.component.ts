import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { MatAccordion } from '@angular/material/expansion';
import { MainComponent } from '../main/main.component';
import { UserService } from 'src/app/services/user.service';
import { DeleteAccountAndDataRequest } from 'src/app/model/user.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  providers: [
    HeaderBarComponent,
    MainComponent
  ]
})
export class MyAccountComponent implements OnInit{

  @ViewChild(MatAccordion) accordion: MatAccordion; 
  
  darkMode: boolean;
  loading: boolean = false;
  username: string;
  password: string;
  confirmation: boolean = false;
  
  ngOnInit(): void {

  }

  constructor(private headerBarComponent: HeaderBarComponent, private userService: UserService) {
    
  }

  toggleDarkMode(themeSelected: any) {
    this.darkMode = themeSelected == 'dark-mode' ? true : false;
    let darkModeSessionSet: string = this.darkMode == true ? 'true' : 'false';
    sessionStorage.setItem('dark-mode', darkModeSessionSet);
    const body = document.getElementById('myAccount');
    body.classList.toggle('dark-mode', this.darkMode);
    this.headerBarComponent.toggleDarkMode();
  }

  deleteAccountAndData() {
    let deleteAccountAndDataRequest: DeleteAccountAndDataRequest = {
      username: this.username,
      password: this.password,
      confirmation: this.confirmation
    }
    this.userService.deleteAccountAndData(deleteAccountAndDataRequest);
  }
}
