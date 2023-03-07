import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { BillboardComponent } from './components/billboard/billboard.component';
import { CreateBillboardComponent } from './components/create-billboard/create-billboard.component';
import { NewsComponent } from './components/news/news.component';
import { PqrsComponent } from './components/pqrs/pqrs.component';

const routes: Routes = [
  {path: 'cartelera', component: BillboardComponent, canActivate: [AuthGuard]},
  {path: 'crearCartelera', component: CreateBillboardComponent, canActivate: [AuthGuard]},
  {path: 'noticias', component: NewsComponent},
  {path:'pqrs',component:PqrsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
