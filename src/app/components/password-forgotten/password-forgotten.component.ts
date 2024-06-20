import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.scss']
})
export class PasswordForgottenComponent {
  passwordRecoveryForm: FormGroup;
  loading: boolean = false;
  disableButton: boolean = false;
  timer: number = 0;
  timerInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogMessage: DialogMessage
  ) {
    this.passwordRecoveryForm = this.fb.group({
      identifier: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.isLoading();
    if (this.passwordRecoveryForm.valid) {
      const identifier = this.passwordRecoveryForm.get('identifier')?.value;
      this.authService.passwordRecovery(identifier).then((result) => {
        this.dialogMessage.openInfoDialog('Instruções de recuperação de senha foram enviadas para seu email.');
        this.startTimer();
      })
      .catch((error) => {
        this.dialogMessage.openErrorDialog('Erro ao solicitar recuperação de senha: ' + error.message);
      })
      .finally(() => {
        this.isLoading();
      });
    }
  }

  startTimer() {
    this.disableButton = true;
    this.timer = 120;

    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.disableButton = false;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  isLoading(): void {
    this.loading = !this.loading;
  }
}
