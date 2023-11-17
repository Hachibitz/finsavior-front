import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { MatAccordion } from '@angular/material/expansion';
import { MainComponent } from '../main/main.component';
import { UserService } from 'src/app/services/user.service';
import { ChangeAccountPasswordRequest, DeleteAccountAndDataRequest } from 'src/app/model/user.model';
import { DialogMessagesComponent } from '../dialog-messages/dialog-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { delay, of } from 'rxjs';

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

  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  changeAccountPasswordRequest: ChangeAccountPasswordRequest;
  
  ngOnInit(): void {

  }

  constructor(private headerBarComponent: HeaderBarComponent, private userService: UserService, private dialog: MatDialog) {
    
  }

  toggleDarkMode(themeSelected: any) {
    this.darkMode = themeSelected == 'dark-mode' ? true : false;
    let darkModeSessionSet: string = this.darkMode == true ? 'true' : 'false';
    localStorage.setItem('dark-mode', darkModeSessionSet);
    const body = document.getElementById('myAccount');
    body.classList.toggle('dark-mode', this.darkMode);
    this.headerBarComponent.toggleDarkMode();
  }

  deleteAccountAndData() {
    const deleteAccountAndDataRequest: DeleteAccountAndDataRequest = {
      username: this.username,
      password: this.password,
      confirmation: this.confirmation
    }

    this.isLoading();
    this.userService.deleteAccountAndData(deleteAccountAndDataRequest).then(result => {
      this.openInfoDialog('Sucesso:' + result.message);
      this.isLoading();
    })
    .catch(error => {
      this.openErrorDialog('Error: ' + error.error);
      this.isLoading();
    });;
  }

  changeAccountPassword() : void {
    if(this.newPasswordConfirmation != this.newPassword) {
      this.openWarnDialog('As senhas não coincidem.');
      return;
    }

    if(!this.isPasswordValid(this.newPassword)) {
      this.openWarnDialog('Critérios da senha não atendidos.');
      return;
    }

    this.changeAccountPasswordRequest = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }

    this.isLoading();
    this.userService.changeAccountPassword(this.changeAccountPasswordRequest).then(result => {
      this.openInfoDialog('Sucesso:' + result.message);
      this.isLoading();
    })
    .catch(error => {
      this.openErrorDialog(error.error);
      this.isLoading();
    })
  }

  isPasswordValid(newPassword: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(newPassword);
  }

  openErrorDialog(errorMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: errorMessage, 
              name: "Erro",
              messageType: "error"
            },
    });
    of('Após 5 segundos').pipe(delay(5000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

  openWarnDialog(warnMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: warnMessage, 
              name: "Aviso",
              messageType: "warn"
            },
    });
    of('Após 3 segundos').pipe(delay(3000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

  openInfoDialog(infoMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: infoMessage, 
              name: "Success",
              messageType: "info"
            },
    });
    of('Após 2 segundos').pipe(delay(2000)).subscribe(result => {
      this.dialog.closeAll();
    });
  }

  isLoading() {
    this.loading = !this.loading;
  }
}
