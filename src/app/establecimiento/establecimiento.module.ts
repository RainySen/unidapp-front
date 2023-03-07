import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstablecimientoRoutingModule } from '../establecimiento/establecimiento-routing.module';
import { EstablecimientoViewComponent } from '../establecimiento/components/establecimiento-view/establecimiento-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EditEstablecimientoComponent } from '../establecimiento/components/edit-establecimiento/edit-establecimiento.component';
import { ListVecinosComponent } from '../vecinos/components/list-vecinos/list-vecinos.component';
import { vecinosModule } from '../vecinos/vecinos.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    EstablecimientoViewComponent,
    EditEstablecimientoComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EstablecimientoRoutingModule,
    ReactiveFormsModule,
    vecinosModule,
    NotificationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ]
})
export class EstablecimientoModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
