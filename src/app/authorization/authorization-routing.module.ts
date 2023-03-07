import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginViewComponent } from './components/login-view/login-view-component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CambiarPassComponent } from './components/cambiar-pass/cambiar-pass.component';


const routes: Routes = [
  {path: 'login',  component: LoginViewComponent, canActivate: [AuthGuard]},
  {path: 'changePassword',  component: CambiarPassComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
