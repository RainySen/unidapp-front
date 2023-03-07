import { Component, OnInit } from '@angular/core';
import { ServiceAuthorizationService } from '../../services/service-authorization.service';
import { Credentials, loginResponse, User } from 'src/utils/models/User';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericResponse } from 'src/utils/models/Business';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login-view-component',
  templateUrl: './login-view-component.html',
  styleUrls: ['./login-view-component.scss']
})
export class LoginViewComponent implements OnInit {

  loginResponse: GenericResponse;
  cookieValue: 'UNKNOWN';
  credentials: Credentials;
  credenciales: FormGroup;
  ErrorMessage400 = false;
  ErrorMessage401 = false;
  ErrorMessage403 = false;
  ErrorMessage405 = false;
  message: string;
  const: number = 0;
  cargo: boolean = false;
  show: any = false;

  constructor(public service: ServiceAuthorizationService,
    private formBuilder: FormBuilder,
    private coockie: CookieService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.credenciales = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      password: ['', [Validators.required]]
      // username: ['dgarzon@pa-co.co', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      // password: ['qwe123**', [Validators.required]]
      // username: ['dilan@pa-co.co', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      // password: ['qwe123**', [Validators.required]]
      // username: ['andres@pa-co.co', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      // password: ['qwe123**', [Validators.required]]
      // username: ['geraltcol@gmail.com', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      // password: ['qwe123**', [Validators.required]]
    });
  }

  contrase() {
    const value = document.getElementById('password').getAttribute("type");

    if (value == 'password') {
      document.getElementById('password').setAttribute("type", "text")
      this.show = true;
    } else {
      document.getElementById('password').setAttribute("type", "password")
      this.show = false;

    }
  }



  login() {
    this.cargo = true;
    this.ErrorMessage400 = false;
    this.ErrorMessage401 = false;
    this.ErrorMessage403 = false;
    this.ErrorMessage405 = false;
    this.service.postCredentials(this.credenciales.value).subscribe(Response => {
      this.loginResponse = Response;
      if (this.loginResponse) {
        const token = btoa(this.loginResponse.genericObject.token);
        const user = btoa(JSON.stringify(this.loginResponse.genericObject.user));
        localStorage.setItem('tokenPaco', token);
        this.coockie.set('user', user);
        this.router.navigate(['/establecimiento']);
      }
      this.cargo = false;
    }, error => {
      if (error.error.code) {
        if (error.error.code == 400) {
          this.ErrorMessage400 = true;
          this.message = error.answer;
          this.const++;
        }
        if (error.error.code == 401) {
          this.ErrorMessage401 = true;
          this.message = error.answer;
        }
        if (error.error.code == 403) {
          this.ErrorMessage403 = true;
          this.message = error.answer;
        }
        if (error.error.code == 405) {
          this.ErrorMessage405 = true;
          this.message = error.answer;
        }
      } else {
        swal.fire({
          title: 'Error',
          html: "Sitio temporalmente fuera de servicio, trata de nuevo más tarde.",
          icon: 'error'
        });
      }
      window.scroll(0,0);
      this.cargo = false;
    });console.log(this.credenciales)
  }
}
