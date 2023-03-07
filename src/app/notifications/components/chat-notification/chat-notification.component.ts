import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';
import { Mensaje, userChat, msg } from 'src/utils/models/notifications/chat-notification';
import { BillboardService } from '../../services/billboard.service';
import Swal from 'sweetalert2';
import { Permissions } from 'src/utils/models/User';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent implements OnInit {
  @Input() opcion;
  @Output() nombreMenu = new EventEmitter<string>();
  @Input() objEstablecimiento: Establecimiento;

  @ViewChild('chatList') chatList: ElementRef;
  @ViewChild('chatBody') chatBody: ElementRef;

  respuesta: Array<any> = new Array();
  chatForm: FormGroup;
  searchUser: FormGroup;
  usuario: userChat;
  NewChat: boolean = false;
  DEFAULT_PICTURE = 'https://firebasestorage.googleapis.com/v0/b/paco-prod.appspot.com/o/default%2FimgDefault.png?alt=media&token=ed7b8995-aa00-4663-a927-4ae8868d3333';
  idUsuarioChat: string;

  chatSeleccionado;
  listadoMensajes: Array<any> = new Array();

  fotoPerfilUser;
  rol: string;
  permisos: Permissions = new Permissions;

  selectedChat: any;
  oldChat: number;
  filterPost = '';

  keys = new Array();
  removeMyMsg = new Array();

  constructor(
    private notificationService: BillboardService,
    private formBuilder: FormBuilder,
    private coockie: CookieService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.obtenerPermisos();
    this.usuario = JSON.parse(atob(this.coockie.get('user')));
    this.usuario.rol = JSON.parse(atob(this.coockie.get('rolN')));
    this.getmessageChat();
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  isBackChat() {
    this.NewChat = false;
  }

  obtenerPermisos() {
    this.notificationService.getPermisos(this.opcion._id).subscribe(Response => {
      this.rol = JSON.parse(atob(this.coockie.get('rol')));
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
      });
    });
  }


  getmessageChat() {
    if (this.usuario.rol == 'Administrador' || this.usuario.rol == 'Portero') {
      this.notificationService.getRequestsByStore(this.objEstablecimiento._id).subscribe(respuesta => {
        this.respuesta = respuesta;
        this.chatSelected(this.oldChat, true);
      }, error => {
      });
    }
    //  else if (this.usuario.rol == 'Vecino') {
    //   this.notificationService.getRequestsByStoreAndUser(this.objEstablecimiento._id, this.usuario._id).subscribe(respuesta => {
    //     console.log('respuesta Vecino', respuesta)
    //     if (respuesta) {
    //       this.respuesta.nombre.push(respuesta);
    //     }
    //   }, error => {
    //     console.log(error);
    //   });
    // }
  }

  conversacionSeleccionada(value, chatSelected: number) {
    this.chatSelected(chatSelected, false);
    this.idUsuarioChat = value.idUsuario;
    this.chatSeleccionado = value;
    this.fotoPerfilUser = value.fotoPerfil;
    this.notificationService.getRequestsByAsset(this.objEstablecimiento._id, value.idUsuario).subscribe(Respuesta => {
      this.listadoMensajes = Respuesta;
      this.getAllMsg()
    }, error => {
    });
  }

  sendMessage() {

    this.usuario.idUsuarioEnvio = this.usuario._id;
    this.usuario.nombre = this.usuario.nombre;
    this.usuario.msg = this.chatForm.get('message').value;
    this.usuario._id = this.idUsuarioChat;
    this.usuario._idEstablecimiento = this.objEstablecimiento._id;

    if (this.usuario._id) {
      this.notificationService.sendMessage(this.usuario);
    }
    this.chatForm.reset();
  }

  chatSelected(chat: number, isRefresh: boolean) {
    let chatSelected = 'chat__selected';
    if (isRefresh) {
      /****
      * Primero se debe de validar si el parametro chat es 0 y después si no es indefinido porque al hacerlo
      * al reves, no entra en la condición de saber si el parametro chat es igual a 0.
      * PD: No se si sea un bug de angular, pero es extraño eso, lo mismo pasa en las otras situaciones dondes se
      * encuentra con los comentarios
      ****/
      if (chat == 0) {
        /****
         * Se debe de indicar explicitamente añadir la clase para la posición 0, ya que por algún extraño
         * motivo, no funciona al añadir la clase de la variable con valor 0
         ****/
        setTimeout(() => {
          this.renderer.addClass(this.chatList.nativeElement.children[0], chatSelected);
        }, 500);

      } else {
        if (chat) {
          setTimeout(() => {
            this.renderer.addClass(this.chatList.nativeElement.children[chat], chatSelected);
          }, 500);
        }
      }
    } else {
      /****
     * Se debe de indicar explicitamente revomer la clase para la posición 0, ya que por algún extraño
     * motivo, no funciona al remover la clase de la variable con valor 0
     ****/
      if (this.oldChat == 0) {
        this.renderer.removeClass(this.chatList.nativeElement.children[0], chatSelected);
      }
      if (!this.oldChat) {
        this.renderer.addClass(this.chatList.nativeElement.children[chat], chatSelected);
        this.oldChat = chat;
      } else {
        this.renderer.addClass(this.chatList.nativeElement.children[chat], chatSelected);
        this.renderer.removeClass(this.chatList.nativeElement.children[this.oldChat], chatSelected);
        this.oldChat = chat;
      }
    }
    setTimeout(() => {
      this.scrollToBottom()
    }, 500);
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async removeMsg(item) {
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
        let data = {
          establishment: this.objEstablecimiento._id, 
          user: this.idUsuarioChat
        }
        this.notificationService.updateMessage(this.keys[item], this.removeMyMsg[item], data);
      }
    });
  }

  // ------ Este metodo se usa para poder borrar los mensajes -----
  async getAllMsg() {
    (await this.notificationService.getListChat(this.objEstablecimiento._id, this.idUsuarioChat).then(res => {
      res.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.keys = Object.keys(data)
          this.removeMyMsg =  Object.values(data);
        }
      });
    }))
  }

}
