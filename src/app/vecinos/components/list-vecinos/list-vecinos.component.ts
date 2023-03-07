import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceVecinos } from '../../services/service-vecinos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditarVecino } from 'src/utils/models/vecinos/editVecino';
import { objEditUser } from 'src/utils/models/usuario/users';
import { CookieService } from 'ngx-cookie-service';
import { Permissions } from 'src/utils/models/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-vecinos',
  templateUrl: './list-vecinos.component.html',
  styleUrls: ['./list-vecinos.component.scss']
})
export class ListVecinosComponent implements OnInit {

  @Input() listadoVecinos: boolean;
  @Input() establecimientoInfo;
  @Input() opcion;
  @Output() nombreMenu = new EventEmitter<string>();

  listado;
  listVecinos;
  listVecinoFilter;

  objEditarVecino: EditarVecino;
  objEditarActivo;
  objEditarUsuario: objEditUser;

  viewEditarVecino: boolean;
  viewEditarActivo: boolean;
  viewCrearUsuario: boolean;

  filtro: FormGroup;

  mensajeCrearNuevo: boolean = true;
  cargando: boolean = false;
  estados: string;
  rol: string;
  permisos: Permissions = new Permissions;

  compareDes = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  compareAsc = (v1: string, v2: string) => v1 > v2 ? -1 : v1 < v2 ? 1 : 0;

  constructor( private service: ServiceVecinos,
               private formBuilder: FormBuilder,
               private cookie: CookieService) {
               }

    btnAbrirPopup = document.getElementById('btn-abrir-popup');
    ovelay = document.getElementById('ovelay');
    popup = document.getElementById('popup');
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');

  ngOnInit(): void {
    this.listado = this.listadoVecinos;
    this.viewEditarVecino = false;
    this.viewEditarActivo = false;
    this.filtro = this.formBuilder.group({
      filtroNombre: [''],
      filtroEstado: ['',Validators.maxLength(1)]
    });
    this.obtenerVecinos();
    this.obtenerPermisos();
  }

  isBackList() {
    this.listado = true;
    this.viewEditarVecino = false;
    this.viewEditarActivo = false;
    this.viewCrearUsuario = false;
  }

  orderBy(num){
    if(num == 1){
      this.listVecinoFilter = [...this.listVecinoFilter].sort((a, b) => {
        const res = this.compareDes(`${a.neighbor.nombres.toLowerCase()}`, `${b.neighbor.nombres.toLowerCase()}`);
        return res;
        });
    }
    if(num == 2){
      this.listVecinoFilter = [...this.listVecinoFilter].sort((a, b) => {
        const res = this.compareAsc(`${a.neighbor.nombres.toLowerCase()}`, `${b.neighbor.nombres.toLowerCase()}`);
        return res;
        });
    }
  }

  filtrarNombre(){
    this.listVecinoFilter = this.listVecinos.filter(element => {
      return element.neighbor.nombres.includes((this.filtro.get('filtroNombre').value.toUpperCase())) ||
      element.neighbor.nombres.includes((this.filtro.get('filtroNombre').value)) ||
      element.neighbor.apellidos.includes((this.filtro.get('filtroNombre').value)) ||
      element.email.includes(this.filtro.get('filtroNombre').value) ||
      element.num_inmueble.includes(this.filtro.get('filtroNombre').value);
    });
  }

  filtrarEstado(){
    this.listVecinoFilter = this.listVecinos.filter(element => {
      return element.neighbor.estado.includes(this.filtro.get('filtroEstado').value.toUpperCase());
    });
  }

  obtenerVecinos(){
     this.cargando = true;
     this.service.obtenerVecinos(this.establecimientoInfo._id).subscribe(Response =>{

       this.listVecinos = Response.genericObject.response;
       this.listVecinoFilter = this.listVecinos;
       this.cargando = false;
       if(this.listVecinos.length == 0){
         this.mensajeCrearNuevo = false;
       }
     });
    }

    crearUsuario(usuario){
      this.cargando = true;
      if(usuario != ""){
        if(this.permisos.modificacion == "S"){
          this.objEditarVecino = usuario;
          this.service.obtenerInmueblesVecino(this.objEditarVecino.neighbor._id).subscribe(Response => {
            this.objEditarUsuario = Response.genericObject;
            this.listado = false;
            this.viewEditarVecino = false;
            this.viewEditarActivo = false;
            this.viewCrearUsuario = true;
            this.nombreMenu.emit('Editar Usuario');
            this.cargando = false;
          });
        }else{
          this.cargando = false;
        }
      }else{
        if(this.permisos.creacion == "S"){
          this.objEditarUsuario = null;
          this.listado = false;
          this.viewEditarVecino = false;
          this.viewEditarActivo = false;
          this.viewCrearUsuario = true;
          this.nombreMenu.emit('Crear/Editar vecino');
          this.cargando = false;
        }else{
          this.cargando = false;
        }
      }
    }

    editarVecino(vecinos){
      if(this.permisos.modificacion == "S"){
        this.objEditarVecino = vecinos;
        this.listado = false;
        this.viewEditarVecino = true;
        this.viewEditarActivo = false;
        this.viewCrearUsuario = false;
        this.nombreMenu.emit('Editar vecino');
      }else{
      }
    }

    editarActivo(activo){
      if(this.permisos.modificacion == "S"){
        this.service.obtenerActivos(activo.num_inmueble, this.establecimientoInfo._id).subscribe(Response => {
          this.objEditarActivo = Response.genericObject;
          this.listado = false;
          this.viewEditarVecino = false;
          this.viewEditarActivo = true;
          this.viewCrearUsuario = false;
          this.nombreMenu.emit('Editar activo');
        }, error => {
          console.log(error);

        }) ;
      }else{
      }
    }

    procesaPropagar() {
      this.listVecinoFilter = null;
      this.listado = true;
      this.viewEditarVecino = false;
      this.viewEditarActivo = false;
      this.viewCrearUsuario = false;
      this.nombreMenu.emit('Administrar cuentas');
      setTimeout(() => {
        this.obtenerVecinos();
      }, 3500);

    }

    obtenerPermisos(){
      this.service.getPermisos(this.opcion._id).subscribe(Response => {
        this.rol = JSON.parse(atob(this.cookie.get('rol')));
        Response.genericObject.forEach(element => {
          if(element.id_rol == this.rol){
            this.permisos = element;
          }
        });
      },error => {
        Swal.fire({
          title: 'Advertencia',
          text: 'El usuario no posee permisos para ingresar a este modulo.',
          icon: 'info',
        });
      });
    }

    eliminarUsuario(vecino){
      if(this.permisos.eliminacion == "S"){
        Swal.fire({
          title: 'Eliminarás un usuario',
          text: '¿Estás seguro de que deseas eliminar el usuario?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, elimínalo',
          cancelButtonText: 'No',
          customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2'
      }
        }).then((result) => {
          if (result.value) {
            this.cargando = true;
              this.service.eliminarUsuario(this.establecimientoInfo._id,vecino.neighbor._id, vecino.num_inmueble).subscribe(Response => {
                Swal.fire({
                  title: 'Eliminaste un usuario.',
                  text: 'El usuario ha sido eliminado correctamente.',
                  icon: 'success'
                });
                this.obtenerVecinos();
              }, error => {
              this.cargando = false;
              Swal.fire({
                title: 'Error',
                text: 'Error eliminando el usuario',
                icon: 'error',
                imageUrl: 'assets/img/Logo_Color.png',
              });
            });
          }else{
            this.cargando = false;
          }
        });
      }
    }
}
