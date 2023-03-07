import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceAuthorizationService } from '../../../authorization/services/service-authorization.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  changePassword: FormGroup;
  cargando: boolean;
  update: boolean = true;
  show: any = false;
  show1: any = false;

  constructor(private fb: FormBuilder,
    private servicio: ServiceAuthorizationService,
    private router: Router) { }

  ngOnInit(): void {
    this.changePassword = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  changePasswordComponent(){
    this.cargando = true;


    // if(this.changePassword.get("oldPassword").value == this.changePassword.get("newPassword").value){


      this.servicio.changePasswordUser(this.changePassword.value).subscribe(response => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada correctamente',
          showConfirmButton: false,
          timer: 3000
        })
        this.update = false;
      }, error => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          html: "Surgio un problema al cambiar la contraseña <br> porfavor valide los datos e intente nuevamente.",
          icon: 'error'
        });
      });


    // }else{
    //   this.cargando = false;
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'No pudimos cambiar tu contraseña',
    //       text: "Las contraseñas que copiaste no coinciden, por favor, inténtalo nuevamente"
    //     })
    // }







  }

  contrase(valor) {
    const value = document.getElementById(valor).getAttribute("type");
    if(valor == "nuevaContrase"){
    if (value == 'password') {
      document.getElementById(valor).setAttribute("type", "text")
      this.show = true;
    } else {
      document.getElementById(valor).setAttribute("type", "password")
      this.show = false;
    }
  }
  if(valor == "confirmContrase"){
    if (value == 'password') {
      document.getElementById(valor).setAttribute("type", "text")
      this.show1 = true;
    } else {
      document.getElementById(valor).setAttribute("type", "password")
      this.show1 = false;
    }
  }
  }

}
