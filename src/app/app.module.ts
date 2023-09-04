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
import { FormControl, FormsModule } from '@angular/forms';
import { LoginDropdownComponent } from './components/login-dropdown/login-dropdown.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from './services/theme.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BillService } from './services/bill.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CadastrarComponent,
    LoginDropdownComponent,
    HeaderBarComponent
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
    NgxDatatableModule,
    PanelModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [UserService, ThemeService, BillService],
  bootstrap: [AppComponent]
})
export class AppModule { }
