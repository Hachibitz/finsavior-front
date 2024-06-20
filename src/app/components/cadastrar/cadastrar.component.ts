import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndPrivacyDialogComponent } from '../terms-and-privacy-dialog/terms-and-privacy-dialog.component';

@Component({
  selector: "app-cadastrar",
  templateUrl: "./cadastrar.component.html",
  styleUrls: ["./cadastrar.component.scss"],
})
export class CadastrarComponent implements OnInit {
  darkMode: boolean = false;
  registerForm: FormGroup;
  loading: boolean = false;
  passwordCriteria = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private dialogMessage: DialogMessage,
    private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required]],
      agreement: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  openTermsDialog() {
    this.dialog.open(TermsAndPrivacyDialogComponent, {
      data: { type: 'terms' }
    });
  }
  
  openPrivacyDialog() {
    this.dialog.open(TermsAndPrivacyDialogComponent, {
      data: { type: 'privacy' }
    });
  }

  signUp() {
    if (this.registerForm.invalid) {
      this.dialogMessage.openWarnDialog('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const signUpRequest: SignUpRequest = {
      email: this.registerForm.get('email')?.value,
      username: this.registerForm.get('username')?.value,
      firstName: this.registerForm.get('name')?.value,
      lastName: this.registerForm.get('lastname')?.value,
      password: this.registerForm.get('password')?.value,
      passwordConfirmation: this.registerForm.get('passwordConfirmation')?.value,
      agreement: this.registerForm.get('agreement')?.value,
    };

    this.isLoading();
    this.authService
      .signUp(signUpRequest)
      .then((result) => {
        this.redirectToLogin();
        this.dialogMessage.openInfoDialog(result.message);
      })
      .catch((error) => {
        this.dialogMessage.openErrorDialog(error.error.message);
      })
      .finally(() => {
        this.isLoading();
      });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('passwordConfirmation')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  checkPassword() {
    const password = this.registerForm.get('password')?.value;
    this.passwordCriteria.length = password.length >= 8;
    this.passwordCriteria.upper = /[A-Z]/.test(password);
    this.passwordCriteria.lower = /[a-z]/.test(password);
    this.passwordCriteria.number = /[0-9]/.test(password);
    this.passwordCriteria.special = /[@$!%*?&]/.test(password);
  }

  redirectToLogin(): void {
    this.router.navigate(["fs/login"]);
  }

  isLoading() {
    this.loading = !this.loading;
  }
}
