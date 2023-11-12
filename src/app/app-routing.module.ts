import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { MainComponent } from './components/main/main.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AuthGuard } from './security/AuthGuard';
import { LoginPageComponent } from './components/login-page/login-page.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: 'fs/main'
  },
  {
    path: 'fs/main',
    canActivate: [AuthGuard],
    component: MainComponent
  },
  {
    path: 'fs/cadastrar',
    component: CadastrarComponent
  },
  {
    path: 'fs/account',
    canActivate: [AuthGuard],
    component: MyAccountComponent
  },
  {
    path: 'fs/login',
    component: LoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
