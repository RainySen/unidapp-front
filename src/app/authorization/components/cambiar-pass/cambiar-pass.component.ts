import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceAuthorizationService } from '../../services/service-authorization.service';
import swal from 'sweetalert2';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.component.html',
  styleUrls: ['./cambiar-pass.component.scss']
})
export class CambiarPassComponent implements OnInit {

  password: FormGroup;

  alerta1: boolean = true;
  alerta2: boolean = false;
  alerta3: boolean = false;
  alerta5: boolean = false;
  alerta6: boolean = false;
  cargando: boolean = false;
  show:any=false;
  show2:any=false;

  urlTree;
  token: string;
  username: string;


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private servicio: ServiceAuthorizationService) {
                this.urlTree = this.router.parseUrl(this.router.url);
                this.token = this.urlTree.queryParams['token'];
                this.username = this.urlTree.queryParams['username'];
              }




  ngOnInit(): void {
    this.password = this.formBuilder.group({
      username: [this.username],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      token: [this.token]
    });

  }

  changePassword(){
    this.cargando = true;
    localStorage.removeItem('tokenPaco');
    this.servicio.changePassword(this.password.value).subscribe(response => {
      this.cargando = false;
      this.alerta1 = false;
      this.alerta2 = true;
      this.alerta3 = false;
      this.alerta5 = false;
      this.alerta6 = false;
    }, error => {
      this.cargando = false;
      if(error.error.code == 400){
        this.alerta1 = false;
        this.alerta2 = false;
        this.alerta3 = false;
        this.alerta5 = false;
        this.alerta6 = true;
      }else{
      if(error.error.code == 403){
        this.alerta1 = false;
        this.alerta2 = false;
        this.alerta3 = false;
        this.alerta5 = true;
        this.alerta6 = false;
      }else{
      if(error.status == 502){
        this.alerta1 = false;
        this.alerta2 = false;
        this.alerta3 = true;
        this.alerta5 = false;
        this.alerta6 = false;
      }else{
        swal.fire({
          title: 'Opss...',
          html: error.error.answer,
          icon: 'warning'
        });
      }}}
    });
  }

  refresh(): void { window.location.reload(); }

  showPassword1() {
    console.log("pasamos por el primer hidden");
    const value = document.getElementById('password').getAttribute("type");

    if (value == 'password') {
      document.getElementById('password').setAttribute("type", "text")
      this.show = true;
    } else {
      document.getElementById('password').setAttribute("type", "password")
      this.show = false;
    }
  }


  showPassword2() {
    const value = document.getElementById('password1').getAttribute("type");

    if (value == 'password') {
      document.getElementById('password1').setAttribute("type", "text")
      this.show2 = true;
    } else {
      document.getElementById('password1').setAttribute("type", "password")
      this.show2 = false;
    }
  }
}
