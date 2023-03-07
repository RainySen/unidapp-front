import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EstablecimientoViewComponent } from './components/establecimiento-view/establecimiento-view.component';
import {AuthGuard} from 'src/utils/guards/auth.guard';
/* import { ListVecinosComponent } from '../vecinos/components/list-vecinos/list-vecinos.component';
import { user } from 'src/utils/models/usuario/users';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento'; */
import { RecuperarComponent } from '../authorization/components/recuperar/recuperar.component';

const routes: Routes = [
  {path: 'establecimiento', component: EstablecimientoViewComponent , canActivate: [AuthGuard]},
  {path: 'recuperarpassword', component: RecuperarComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EstablecimientoRoutingModule { }
