import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceAuthorizationService } from '../../services/service-authorization.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent implements OnInit {

    credenciales: FormGroup;
    password: FormGroup;
    formulario1: boolean = true;
    formulario2: boolean = false;
    cargando: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private servicio: ServiceAuthorizationService
  ) { }

  ngOnInit(): void {
    this.credenciales = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
    });
  }
  recuperar(){
    this.cargando = true;
    this.servicio.restorePassword(this.credenciales.value).subscribe(response => {
      console.log('recuperar pass', response);

      this.cargando = false;
      this.formulario2 = true;
      this.formulario1 = false;
    }, error => {
      this.cargando = false;
      swal.fire({
        title: 'Opss...',
        html: error.error.answer,
        icon: 'warning'
      });
    });
  }
}
