import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginViewComponent } from './components/login-view/login-view-component';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CambiarPassComponent } from './components/cambiar-pass/cambiar-pass.component';



@NgModule({
  declarations: [
    LoginViewComponent,
    RecuperarComponent,
    CambiarPassComponent
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
    AuthorizationRoutingModule
  ]
})
export class AuthorizationModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
