import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';
import Swal from 'sweetalert2';
import { News } from '../../../../utils/models/notifications/news';
import { BillboardService } from '../../services/billboard.service';
import { Permissions } from 'src/utils/models/User';

import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @Input() opcion;
  @Input() objNew: News;
  @Output() nombreNoticia = new EventEmitter<string>();
  @Input() objEstablecimiento: Establecimiento;

  rol: string;
  cargando = false;
  noticias: News[] = [];
  news: News = new News;
  editar = false;
  permisos: Permissions = new Permissions;
  show: boolean = true;



  constructor(private billboardService: BillboardService,
    private storage: AngularFireStorage,
    private cookie: CookieService) { }

  ngOnInit(): void {    
    this.obtenerNoticias();    
    this.obtenerPermisos();
  }

  isBackNews() {
    this.editar = false;
  }

  accionesNoticias(noticia) {

    this.nombreNoticia.emit('Acciones de noticia');
    if (noticia == '') {
      noticia = new News;
    }
    this.news = noticia;
    this.news.id_establishment = this.objEstablecimiento._id;
    this.editar = true;
  }

  obtenerNoticias() {
    const isNews = {
      type: 'N',
      direction: 'des',
      direction_by: 'start_date'
    };
    this.billboardService.getNews(this.objEstablecimiento._id, isNews).subscribe(Response => {
      this.noticias = Response.genericObject;
      if(this.noticias.length != 0){
        this.show = false;
      } 
      this.cargando = false;
      this.noticias.sort((a,b)=>b.created_at.localeCompare(a.created_at));
    }, error => {
      this.cargando = false;
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error'
      });
    });
  }

  eliminarNoticia(news) {
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
              ¿Estás seguro de eliminar la noticia?
            </p>
        </div>
      </div>`,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: '¡No!',
      confirmButtonText: '¡si, eliminar!',
    }).then((result) => {
      if (result.value) {
        this.billboardService.deleteNew(news._id).subscribe(Response => {
          this.obtenerNoticias();
          news.images.forEach(element => {
            var storage = this.storage.storage;
            var storageRef = storage.refFromURL(element);
            storageRef.delete().then(function () {
            }).catch(function (error) {
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
                    La noticia ha sido eliminada correctamente
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
                  Error al borar la noticia
                <h4>
                <p class="alert__description">
                  No se pudor borrar la noticia
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
        title: 'Advertencia',
        text: 'El usuario no posee permisos para ingresar a este modulo.',
        icon: 'info',
      });
    });
  }
  
  procesaPropagar() {
    this.nombreNoticia.emit('Cartelera');
    this.obtenerNoticias();
    this.editar = false;
  }

}
