import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { MainComponent } from './components/main/main.component';
import { MyAccountComponent } from './components/my-account/my-account.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'fs/main',
    component: MainComponent
  },
  {
    path: 'fs/cadastrar',
    component: CadastrarComponent
  },
  {
    path: 'fs/account',
    component: MyAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
