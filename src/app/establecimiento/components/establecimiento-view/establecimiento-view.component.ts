import { FormGroup, FormBuilder, Validators, AbstractFormGroupDirective } from '@angular/forms';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/utils/models/User';
import { ServiceEstablecimientoService } from '../../services/service-establecimiento.service';
import { Establecimiento, opciones } from 'src/utils/models/establecimiento/establecimiento';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceAuthorizationService } from 'src/app/authorization/services/service-authorization.service';
import { UserPassword } from 'src/utils/models/usuario/password';

import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { BillboardComponent } from '../../../notifications/components/billboard/billboard.component';
import { NewsComponent } from '../../../notifications/components/news/news.component';
import { ChatNotificationComponent } from '../../../notifications/components/chat-notification/chat-notification.component';
import { ListVecinosComponent } from '../../../vecinos/components/list-vecinos/list-vecinos.component';
import { PqrsComponent } from 'src/app/notifications/components/pqrs/pqrs.component';




@Component({
  selector: 'app-estableimiento-view',
  templateUrl: './establecimiento-view.component.html',
  styleUrls: ['./establecimiento-view.component.scss']
})

export class EstablecimientoViewComponent implements OnInit {
  // ------ Se añade la clase para indicar en que menú se encuentra ------
  activeLink = 'active-link';
  @ViewChild("inicioBtn") inicioBtn!: ElementRef;
  @ViewChild("edificioBtn") edificioBtn!: ElementRef;
  @ViewChild("userBtn") userBtn!: ElementRef;
  @ViewChild("establismentBtn") establismentBtn!: ElementRef;
  @ViewChild("carteleraBtn") carteleraBtn!: ElementRef;
  @ViewChild("noticiasBtn") noticiasBtn!: ElementRef;
  @ViewChild("novedadesBtn") novedadesBtn!: ElementRef;
  @ViewChild("pqrsBtn") pqrsBtn!: ElementRef;
  // ------ Se llama un metodo en el componente hijo ------
  @ViewChild(ListVecinosComponent) listVecinosComponent: ListVecinosComponent;
  @ViewChild(BillboardComponent) billboardComponent: BillboardComponent;
  @ViewChild(NewsComponent) newsComponent: NewsComponent;
  @ViewChild(ChatNotificationComponent) chatComponent: ChatNotificationComponent;
  @ViewChild(PqrsComponent) pqrsComponent: PqrsComponent;

  User: User;
  Establecimientos: Establecimiento[];
  SelEstablForm: FormGroup;
  establecimiento: Establecimiento = new Establecimiento();
  opciones: opciones[];
  ancla: any;
  objVecino;
  opcionSelect;
  RolUser: any = 'user';
  cargando: boolean;
  password: FormGroup;
  passwordUser: UserPassword;
  username: string;
  urlTree;
  token: string;
  tokens = [];
  lisTokens = [];
  buttonAvtived;


  alerta1: boolean = true;
  alerta2: boolean = false;
  alerta3: boolean = false;
  alerta5: boolean = false;
  alerta6: boolean = false;

  inicio: boolean;
  vecinoList: boolean;
  editar: boolean;
  cartelera: boolean;
  news: boolean;
  notificaciones: boolean;
  perfil: boolean;
  pqrs: boolean;
  nombreMenu: string = 'Inicio';

  url: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private servicio: ServiceAuthorizationService,
    private service: ServiceEstablecimientoService,
    private renderer: Renderer2) {
    this.urlTree = this.router.parseUrl(this.router.url);
    this.token = this.urlTree.queryParams['tokenPaco'];
    this.username = this.urlTree.queryParams['username'];
  }



  ngOnInit() {
    this.getEstablecimientos();
    this.User = JSON.parse(atob(this.cookie.get('user')));
    this.getUser(this.User._id);
    this.SelEstablForm = this.formBuilder.group({
      EstablecimientoSeleccionadoForm: []
    });
    this.password = this.formBuilder.group({
      username: [this.username],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      token: [this.token]
    });
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.pa-co.co/");

    console.log(this.User);


    this.accion("", '')
  }

  cerrarSesion() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Realmente deseas cerrar la sesión?.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2'
      }
    }).then((result) => {
        if (result.value) {
          localStorage.clear();
          sessionStorage.clear();
          this.cookie.deleteAll();
          window.location.href = '/#'
        }
      });
  }

   getEstablecimientos() {
    this.cargando = true;
    this.service.getEstablecimientos().subscribe(response => {
      this.Establecimientos = response.genericObject;
      this.establecimiento = this.Establecimientos[0];
      this.service.getOptions().subscribe(response => {
        this.opciones = response.genericObject;
        this.SelEstablForm = this.formBuilder.group({ EstablecimientoSeleccionadoForm: ['', []] });
        this.cargando = false;
      }, error => {
        Swal.fire({
          title: 'Error.',
          text: 'Estamos experimentando problemas, intenta loguearte nuevamente o contacta al soporte.',
          icon: 'error'
        });
        localStorage.clear();
        sessionStorage.clear();
        this.cookie.deleteAll();
        this.router.navigate(['/login']);
      });
    }, error => {
      Swal.fire({
        title: 'Error.',
        text: 'Estamos experimentando problemas, intenta loguearte nuevamente o contacta al soporte.',
        icon: 'error'
      });
      localStorage.clear();
      sessionStorage.clear();
      this.cookie.deleteAll();
      this.router.navigate(['/login']);
    });
  }

  cambiarEstablecimiento() {
    this.establecimiento = this.Establecimientos[this.SelEstablForm.get('EstablecimientoSeleccionadoForm').value];
    this.vecinoList = false;
    this.editar = false;
    this.cartelera = false;
    this.nombreMenu = 'Inicio';
  }

  esconderMenu() {
    this.ancla = document.getElementsByClassName('lista-ocultar');
    for (let i = 0; i < this.ancla.length; i++) {
      this.ancla[i].classList.toggle('ocultar');
    }
  }

  nombreDelMenu(nombre) {
    this.nombreMenu = nombre;
  }

  accion(accion, opcion) {
    this.opcionSelect = opcion;
    switch (accion) {
      case 'inicio':
        this.vecinoList = false;
        this.inicio = true;
        this.editar = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Inicio';
        this.renderer.addClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'listado':
        this.vecinoList = true;
        this.inicio = false;
        this.editar = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Administrar cuentas - Usuarios';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.addClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'editar':
        this.inicio = false;
        this.editar = true;
        this.vecinoList = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Administrar cuentas - Establecimiento';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.addClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'cartelera':
        this.inicio = false;
        this.editar = false;
        this.vecinoList = false;
        this.cartelera = true;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Cartelera';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.addClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'news':
        this.inicio = false;
        this.editar = false;
        this.vecinoList = false;
        this.cartelera = false;
        this.news = true;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Noticias';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.addClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'notificaciones':
        this.inicio = false;
        this.editar = false;
        this.vecinoList = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = true;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Notificaciones';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.addClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.removeClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      case 'Perfil':
        this.inicio = false;
        this.vecinoList = false;
        this.editar = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = true;
        this.pqrs = false;
        this.nombreMenu = 'Administrar perfil';
        break;
      case 'PQRS':
        this.inicio = false;
        this.vecinoList = false;
        this.editar = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = true;
        this.nombreMenu = 'PQRS-F';
        this.renderer.removeClass(this.inicioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.edificioBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.userBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.establismentBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.carteleraBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.noticiasBtn.nativeElement, this.activeLink);
        this.renderer.removeClass(this.novedadesBtn.nativeElement, this.activeLink);
        // this.renderer.addClass(this.pqrsBtn.nativeElement, this.activeLink);
        break;
      default: {
        this.inicio = true;
        this.vecinoList = false;
        this.editar = false;
        this.cartelera = false;
        this.news = false;
        this.notificaciones = false;
        this.perfil = false;
        this.pqrs = false;
        this.nombreMenu = 'Inicio';
        break;
      }
    }
  }

  // ------ Esto se maneja aparte del metodo "accion" ya que al añadir estas funcionalidades ahí, no funcionan ------
  isBackComponent(key) {
    switch (key) {
      case 'carteleras':
        this.billboardComponent.isBackBillboard();
        break;

      case 'noticias':
        this.newsComponent.isBackNews();
        break;

      case 'chat':
        this.chatComponent.isBackChat();
        break;

      case 'usuarios':
        this.listVecinosComponent.isBackList();
        break;

      case 'pqrs':
        this.pqrsComponent.isBackPqrs();
        break;

      default:
        break;
    }
  }

  getUser(idusuario) {
    this.service.getUser(idusuario).subscribe(Response => {
      this.objVecino = Response;
      this.getRol();
    }, error => {
      Swal.fire({
        title: 'Error.',
        text: 'Estamos experimentando problemas, intenta loguearte nuevamente o contacta al soporte.',
        icon: 'error'
      });
      localStorage.clear();
      sessionStorage.clear();
      this.cookie.deleteAll();
      this.router.navigate(['/login']);
    });
  }

  getRol() {
    this.service.getRol().subscribe(Response => {
      this.RolUser = Response.genericObject;
      this.cookie.set('rol', btoa(JSON.stringify(this.RolUser._id)));
      this.cookie.set('rolN', btoa(JSON.stringify(this.RolUser.nom_rol)));
    }, error => {
      Swal.fire({
        title: 'Error.',
        text: 'Estamos experimentando problemas, intenta loguearte nuevamente o contacta al soporte.',
        icon: 'error'
      });
      localStorage.clear();
      sessionStorage.clear();
      this.cookie.deleteAll();
      this.router.navigate(['/login']);
    });

  }

}

