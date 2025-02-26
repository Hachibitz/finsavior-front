import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginDropdownComponent } from './components/login-dropdown/login-dropdown.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { UserService } from './services/user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ThemeService } from './services/theme.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BillService } from './services/bill.service';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenInterceptor } from './security/TokenInterceptor'
import { AuthService } from './services/auth.service';
import { AuthGuard } from './security/AuthGuard';
import { DialogMessagesComponent } from './components/dialog-messages/dialog-messages.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditTableDialogComponent } from './components/edit-table-dialog/edit-table-dialog.component';
import { RecurrentBillDialogComponent } from './components/recurrent-bill-dialog/recurrent-bill-dialog.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DialogMessage } from './services/dialog-message.service';
import { SuggestionPageComponent } from './components/suggestion-page/suggestion-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { PlansPageComponent } from './components/plans-page/plans-page.component';
import { AiAdviceDialogComponent } from './components/ai-advice-dialog/ai-advice-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { AiAdvicesComponent } from './components/ai-advices/ai-advices.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaymentService } from './services/payment.service';
import { LoadingService } from './services/loading-service';
import { MatSliderModule } from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AiAnalysisListComponent } from './components/ai-analysis-list/ai-analysis-list.component';
import { AiAnalysisDetailComponent } from './components/ai-analysis-detail/ai-analysis-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TermsAndPrivacyDialogComponent } from './components/terms-and-privacy-dialog/terms-and-privacy-dialog.component';
import { TermsAndPrivacyService } from './services/terms-and-privacy-service';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordForgottenComponent } from './components/password-forgotten/password-forgotten.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CadastrarComponent,
    LoginDropdownComponent,
    HeaderBarComponent,
    MyAccountComponent,
    DialogMessagesComponent,
    EditTableDialogComponent,
    RecurrentBillDialogComponent,
    LoginPageComponent,
    SuggestionPageComponent,
    PlansPageComponent,
    AiAdviceDialogComponent,
    AiAdvicesComponent,
    PaypalComponent,
    AiAnalysisListComponent,
    AiAnalysisDetailComponent,
    ConfirmationDialogComponent,
    TermsAndPrivacyDialogComponent,
    PasswordResetComponent,
    PasswordForgottenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    MatTabsModule,
    SplitButtonModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PanelModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatRadioModule,
    NgxPayPalModule,
    MatSliderModule,
    NgxSliderModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [
    UserService, 
    ThemeService, 
    BillService,
    AuthService,
    PaymentService, 
    LoadingService, 
    MatDialog, 
    AuthGuard,
    DialogMessage,
    TermsAndPrivacyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
