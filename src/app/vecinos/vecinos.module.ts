import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ListVecinosComponent } from './components/list-vecinos/list-vecinos.component';
import { EditVecinoComponent } from './components/edit-vecino/edit-vecino.component';
import { vecinosRoutingModule } from './vecinos-routing.module';
import { ActivoViewComponent } from './components/activo-view/activo-view.component';
import { CreateVecinoComponent } from './components/create-vecino/create-vecino.component';



@NgModule({
  declarations: [
    ListVecinosComponent,
    EditVecinoComponent,
    ActivoViewComponent,
    CreateVecinoComponent,
  ],
  exports: [
    ListVecinosComponent,
    ActivoViewComponent,
    CreateVecinoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    vecinosRoutingModule
  ]
})
export class vecinosModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
