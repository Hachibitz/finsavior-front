import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignUpRequest } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogMessagesComponent } from '../dialog-messages/dialog-messages.component';
import { delay, of } from 'rxjs';

@Component({
  selector: "app-cadastrar",
  templateUrl: "./cadastrar.component.html",
  styleUrls: ["./cadastrar.component.scss"],
})
export class CadastrarComponent implements OnInit {
  darkMode: boolean = false;
  email: string;
  username: string;
  name: string;
  lastname: string;
  password: string;
  passwordConfirmation: string;
  agreement: boolean;
  signUpRequest: SignUpRequest;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  signUp() {
    if (this.signUpValidations() != null) {
      this.openWarnDialog(this.signUpValidations());
      return;
    }

    this.signUpRequest = {
      email: this.email,
      username: this.username,
      firstName: this.name,
      lastName: this.lastname,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      agreement: this.agreement,
    };

    this.authService
      .signUp(this.signUpRequest)
      .then((result) => {
        this.redirectToLogin();
        this.openInfoDialog(result.message);
      })
      .catch((error) => {
        this.openErrorDialog(error.error.message);
      });
  }

  signUpValidations(): string | null {
    if (this.passwordConfirmation !== this.password) {
      return "As senhas não coincidem.";
    }
    if (!this.isPasswordValid(this.password)) {
      return "Critérios da senha não atendidos.";
    }
    if (!this.isEmailValid(this.email)) {
      return "Email inválido.";
    }
    if (this.username.length < 4) {
      return "Usuário precisa ter 4 ou mais caracteres.";
    }
    if (!this.containSymbols(this.username)) {
      return "Usuário não pode conter símbolos.";
    }
    if (this.name.length < 2) {
      return "Nome precisa ter 2 ou mais caracteres.";
    }
    if (!this.containSymbols(this.name)) {
      return "Nome não pode conter símbolos.";
    }
    if (this.lastname.length < 2) {
      return "Sobrenome precisa ter 2 ou mais caracteres.";
    }
    if (!this.containSymbols(this.lastname)) {
      return "Sobrenome não pode conter símbolos.";
    }
    if (!this.agreement) {
      return "Os termos precisam ser aceitos para a realização do cadastro.";
    }

    return null;
  }

  isPasswordValid(newPassword: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(newPassword);
  }

  isEmailValid(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  containSymbols(username: string) {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(username);
  }

  openInfoDialog(infoMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: infoMessage, name: "Success", messageType: "info" },
    });
    of("Após 2 segundos")
      .pipe(delay(2000))
      .subscribe((result) => {
        this.dialog.closeAll();
      });
  }

  openWarnDialog(warnMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: warnMessage, name: "Aviso", messageType: "warn" },
    });
    of("Após 3 segundos")
      .pipe(delay(3000))
      .subscribe((result) => {
        this.dialog.closeAll();
      });
  }

  openErrorDialog(errorMessage: string): void {
    this.dialog.open(DialogMessagesComponent, {
      data: { message: errorMessage, name: "Erro", messageType: "error" },
    });
    of("Após 5 segundos")
      .pipe(delay(5000))
      .subscribe((result) => {
        this.dialog.closeAll();
      });
  }

  redirectToLogin(): void {
    this.router.navigate(["fs/login"]);
  }
}
