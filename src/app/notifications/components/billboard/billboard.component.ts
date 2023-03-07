import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillboardService } from '../../services/billboard.service';
import { Billboard } from 'src/utils/models/notifications/cartelera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';
import Swal from 'sweetalert2';
import { Permissions } from 'src/utils/models/User';
import { CookieService } from 'ngx-cookie-service';

import { AngularFireStorage } from '@angular/fire/storage';
import moment from 'moment';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent implements OnInit {

  @Input() objEstablecimiento: Establecimiento;
  @Input() opcion;
  @Output() nombreMenu = new EventEmitter<string>();

  limitDesc = 140;
  limitTitle = 40;

  billboards: Billboard[] = [];
  billboard: Billboard = new Billboard;
  carteleraForm: FormGroup;
  cargando: boolean = false;
  editar: boolean = false;
  rol: string;
  permisos: Permissions = new Permissions;
  mostimportant: Billboard = new Billboard;

  constructor(private billboardService: BillboardService,
    private storage: AngularFireStorage,
    private cookie: CookieService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.obtenerCarteleras();
    this.obtenerPermisos();

  }

  isBackBillboard() {
    this.editar = false;
  }

  accionesCartelera(cartelera) {
    this.nombreMenu.emit('Acciones de cartelera');
    if (cartelera == '') {
      cartelera = new Billboard;
    }
    this.billboard = cartelera;
    this.billboard.id_establishment = this.objEstablecimiento._id;
    this.editar = true;
  }

  eliminarCartelera(billboard) {
    this.cargando = true;
    Swal.fire({
      html: `
      <div class="alert__container">
        <div class="alert__header header__success"></div>
        <div class="alert__content">
          <h4 class="alert__title title__success">
            ¡Espera!
          <h4>
            <p class="alert__description">
              ¿Estás seguro de eliminar la cartelera?
            </p>
        </div>
      </div>`,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: '¡No!',
      confirmButtonText: '¡si, eliminar!',
    }).then((result) => {
      if (result.value) {
        this.billboardService.deleteBillboard(billboard._id).subscribe(Response => {
          this.obtenerCarteleras();
          billboard.images.forEach(element => {
            var storage = this.storage.storage;
            var storageRef = storage.refFromURL(element);
            storageRef.delete().then(function () {
            }).catch(function (error) {
              Swal.fire({
                title: 'Error.',
                text: error,
                icon: 'success',
                confirmButtonText: 'ok',
                confirmButtonColor: '#3DB5FF'
              });
            });
          });
          Swal.fire({
            html: `
            <div class="alert__container">
              <div class="alert__header header__success"></div>
              <div class="alert__content">
              <h4 class="alert__title title__success">
                Eliminación correcta
              <h4>
                  <p class="alert__description">
                    La carterela ha sido eliminada correctamente
                  </p>
              </div>
            </div>`,
            reverseButtons: true,
            showCancelButton: false,
            confirmButtonText: 'Continuar',
          });
        }, error => {
          this.cargando = false;
          Swal.fire({
            html: `
            <div class="alert__container">
              <div class="alert__header header__error"></div>
              <div class="alert__content">
                <h4 class="alert__title title__error">
                  Error al borar la cartelera
                <h4>
                <p class="alert__description">
                  No se pudor borrar la cartelera
                </p>
              </div>
            </div>`,
            reverseButtons: true,
            showCancelButton: false,
            confirmButtonText: 'Continuar',
          });
        });
      } else {
        this.cargando = false;
      }
    });
  }


  obtenerCarteleras() {
    const isBillboard = {
      type: 'C',
      direction: 'des',
      direction_by: 'start_date'
    };

    this.billboardService.getBillboard(this.objEstablecimiento._id, isBillboard).subscribe(Response => {
      this.billboards = Response.genericObject;
      let importantFlag = false;
      this.billboards.forEach(element => {
        if (element.is_important == "true" && !importantFlag) {
          this.mostimportant = element;
          console.log('consultando la cartelera importante', this.mostimportant);
          importantFlag = true;
        }
      });
      this.billboards.sort((a,b)=>b.start_date.localeCompare(a.start_date));
      this.cargando = false;
    }, error => {
      this.cargando = false;
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error',
        confirmButtonText: 'ok',
        confirmButtonColor: '#3DB5FF'
      });
    });
  }

  procesaPropagar() {
    this.cargando = true;
    this.billboards = null;
    this.nombreMenu.emit('Cartelera');
    this.obtenerCarteleras();
    this.editar = false;
  }

  obtenerPermisos() {
    this.billboardService.getPermisos(this.opcion._id).subscribe(Response => {
      this.rol = JSON.parse(atob(this.cookie.get('rol')));
      Response.genericObject.forEach(element => {
        if (element.id_rol == this.rol) {
          this.permisos = element;
        }
      });
    }, error => {
      Swal.fire({
        title: 'Advertencia.',
        text: 'El usuario no posee permisos para ingresar a este modulo.',
        icon: 'info',
        confirmButtonText: 'ok',
        confirmButtonColor: '#3DB5FF'
      });
    });
  }

}
