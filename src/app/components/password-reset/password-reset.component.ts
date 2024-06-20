import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent  implements OnInit {
  resetPasswordForm: FormGroup;
  token: string;
  passwordRequirements = [
    { label: 'Pelo menos 1 letra maiúscula', pattern: /[A-Z]/, valid: false },
    { label: 'Pelo menos 1 letra minúscula', pattern: /[a-z]/, valid: false },
    { label: 'Pelo menos 1 número', pattern: /\d/, valid: false },
    { label: 'Pelo menos 1 símbolo', pattern: /[\W_]/, valid: false },
    { label: 'Mínimo de 8 caracteres', pattern: /.{8,}/, valid: false }
  ];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialogMessage: DialogMessage
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    this.passwordRequirements.forEach(req => req.valid = req.pattern.test(value));
    return this.passwordRequirements.every(req => req.valid) ? null : { invalidPassword: true };
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('password')?.value;

      this.isLoading();
      this.authService.resetPassword(this.token, newPassword).then((result) => {
        this.dialogMessage.openInfoDialog("Senha redefinida com sucesso!");
      })
      .catch((error) => {
        this.dialogMessage.openErrorDialog("Erro ao redefinir senha: "+error.message);
      })
      .finally(() => {
        this.isLoading();
      });
    }
  }

  isLoading(): void {
    this.loading = !this.loading;
  }
}
