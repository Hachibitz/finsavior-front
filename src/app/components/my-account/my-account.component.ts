import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { MatAccordion } from '@angular/material/expansion';
import { MainComponent } from '../main/main.component';
import { UserService } from 'src/app/services/user.service';
import { ChangeAccountPasswordRequest, DeleteAccountAndDataRequest, UploadProfilePictureRequest } from 'src/app/model/user.model';
import { DialogMessage } from 'src/app/services/dialog-message.service';

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
  @ViewChild('fileInput') fileInput;

  userProfilePicture: string = 'https://tds-images.thedailystar.net/sites/default/files/styles/amp_metadata_content_image_min_696px_wide/public/images/2022/10/14/ai_art_generator.png';
  
  darkMode: boolean;
  loading: boolean = false;
  username: string;
  password: string;
  confirmation: boolean = false;

  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  changeAccountPasswordRequest: ChangeAccountPasswordRequest;

  private static MAX_PROFILE_IMAGE_SIZE_KB: number = 5120;
  
  ngOnInit(): void {
    this.isLoading();
    this.loadUserProfile();
  }

  constructor(private headerBarComponent: HeaderBarComponent, private userService: UserService, private dialogMessage: DialogMessage) {
    
  }

  loadUserProfile() {
    this.userService.getProfileData().then(result => {
        this.userProfilePicture = 'data:image/png;base64,' + result.profilePicture;
        this.isLoading();
    })
    .catch(error => {
        this.dialogMessage.openErrorDialog('Erro ao carregar perfil do usuário: ' + error.error);
        this.isLoading();
    });
  }

  uploadProfilePicture() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.isLoading();

      const fileSizeInKb: number = (file.size / 1024); 
      if(fileSizeInKb > MyAccountComponent.MAX_PROFILE_IMAGE_SIZE_KB) {
        this.dialogMessage.openWarnDialog("Tamanho máximo da imagem precisa ser de 5mb e formato deve ser PNG ou JPG");
        this.isLoading();
        return;
      }

      const formData = new FormData();
      formData.append('profilePicture', file);

      this.userService.uploadProfilePicture(formData).then(result => {
        this.dialogMessage.openInfoDialog(result.message);
        this.loadUserProfile();
      })
      .catch(error => {
        this.dialogMessage.openErrorDialog('Error: ' + error.error);
        this.isLoading();
      });
    }
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
      this.dialogMessage.openInfoDialog('Sucesso:' + result.message);
      this.isLoading();
    })
    .catch(error => {
      this.dialogMessage.openErrorDialog('Error: ' + error.error);
      this.isLoading();
    });;
  }

  changeAccountPassword() : void {
    if(this.newPasswordConfirmation != this.newPassword) {
      this.dialogMessage.openWarnDialog('As senhas não coincidem.');
      return;
    }

    if(!this.isPasswordValid(this.newPassword)) {
      this.dialogMessage.openWarnDialog('Critérios da senha não atendidos.');
      return;
    }

    this.changeAccountPasswordRequest = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }

    this.isLoading();
    this.userService.changeAccountPassword(this.changeAccountPasswordRequest).then(result => {
      this.dialogMessage.openInfoDialog('Sucesso:' + result.message);
      this.isLoading();
    })
    .catch(error => {
      this.dialogMessage.openErrorDialog(error.error);
      this.isLoading();
    })
  }

  isPasswordValid(newPassword: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(newPassword);
  }

  isLoading() {
    this.loading = !this.loading;
  }
}
