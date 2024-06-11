import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { MainComponent } from './components/main/main.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AuthGuard } from './security/AuthGuard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SuggestionPageComponent } from './components/suggestion-page/suggestion-page.component';
import { PlansPageComponent } from './components/plans-page/plans-page.component';
import { AiAdvicesComponent } from './components/ai-advices/ai-advices.component';
import { AiAnalysisListComponent } from './components/ai-analysis-list/ai-analysis-list.component';
import { AiAnalysisDetailComponent } from './components/ai-analysis-detail/ai-analysis-detail.component';


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
    path: 'fs/main/:isRedirectToAiAnalysis',
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
  },
  {
    path: 'fs/suggestion',
    component: SuggestionPageComponent
  },
  {
    path: 'fs/plans',
    component: PlansPageComponent
  },
  {
    path: 'fs/ai-advices',
    component: AiAdvicesComponent
  },
  {
    path: 'fs/ai-analysis-list',
    component: AiAnalysisListComponent
  },
  {
    path: 'fs/ai-analysis-detail/:id',
    component: AiAnalysisDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
