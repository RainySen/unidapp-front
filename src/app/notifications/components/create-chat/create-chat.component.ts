import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';
import { datachat, inmuebleChat, tokenNotify, userChat, userChatCreate } from 'src/utils/models/notifications/chat-notification';
import { BillboardService } from '../../services/billboard.service';
import firebase from 'firebase'

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { notification, to } from 'src/utils/models/Business';
import { NotificationService } from '../../services/notification.service';

import { AngularFireDatabase } from '@angular/fire/database';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  chatForm: FormGroup;
  categoryForm: FormGroup;
  usuario;
  mensaje: userChat = new userChat();
  @Input() objEstablecimiento: Establecimiento;
  @Output() newChat = new EventEmitter<boolean>();
  infoInmuebles: inmuebleChat[];
  infoInmueble: inmuebleChat;
  users: userChatCreate[];
  user: userChatCreate;
  categorias;
  tokenNotify : tokenNotify;

  objDataChat: datachat = new datachat();

  notification: notification = new notification();
  to: to;

  cargando: boolean;

  selectedCategory: any


  public Editor = ClassicEditor;

  constructor(
    private formBuilder: FormBuilder,
    private coockie: CookieService,
    private service: BillboardService,
    private db: AngularFireDatabase,
    private notificationService: NotificationService) {
     }

  ngOnInit(): void {
    this.usuario = JSON.parse(atob(this.coockie.get('user')));
    this.usuario.rol = JSON.parse(atob(this.coockie.get('rolN')));
    this.chatForm = this.formBuilder.group({
      categoria: ['', Validators.required],
      idInmueble: ['', Validators.required],
      idusuario: ['', Validators.required],
      messaje: ['', Validators.required]
    });

    this.categoryForm = this.formBuilder.group({
      id_establishment: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      criticity: ['', Validators.required],
      requireAnswer: [false]
    })
    this.obtenerCategorias();
    this.getInmueble();
  }

  obtenerCategorias(){
    this.cargando = true;
    this.service.getCategory(this.objEstablecimiento._id).subscribe(response => {
      this.categorias = response.genericObject;
      this.cargando = false;
    }, error => {
      this.cargando = false;
    })
  }

  crearCategoria(){
    this.cargando = true;
    this.categoryForm.get('id_establishment').setValue(this.objEstablecimiento._id);
    this.service.createCategory(this.categoryForm.value).subscribe(response => {
      this.obtenerCategorias();
    }, error => {
      this.cargando = false;
    })

  }


  getInmueble(){
    this.cargando = true;
    this.service.getInmueble(this.objEstablecimiento._id).subscribe(Result => {
      this.infoInmuebles = Result.genericObject;
      this.cargando = false;
    },error => {
      this.cargando = false;
    })
  }

  getUsers(){
    this.cargando = true;
    this.service.getUsers(this.chatForm.get('idInmueble').value,this.objEstablecimiento._id).subscribe(Response => {
      this.users = Response.genericObject;
      this.cargando = false;
    }, error => {
      this.cargando = false;
    });
  }

  enviarmensaje(){
    this.cargando = true;
    this.objMensaje();
    this.service.sendMessage(this.mensaje);
    this.cargando = false;
  }

  createMessage(){
    this.cargando = true;
    this.objMensaje();
    this.service.newMessage(this.objEstablecimiento._id, this.objDataChat, this.mensaje);
    setTimeout(() => {
    this.newChat.emit(false);
    this.getTokenNotification('Nuevo mensaje', this.chatForm.get('messaje').value);
    }, 1500);
  }

  regresar(){
    this.newChat.emit(false);
  }

  objMensaje(){
    this.user = this.users.find(usuario => usuario._id == this.chatForm.get('idusuario').value);
    this.infoInmueble = this.infoInmuebles.find(inmueble => inmueble._id == this.chatForm.get('idInmueble').value);

    this.objDataChat.fotoPerfil = this.user.foto;
    this.objDataChat.nombreUsuario = this.user.nombres;
    this.objDataChat.numeroInmueble = this.infoInmueble.num_inmueble;
    this.objDataChat.idUsuario = this.user.id_usuario;

    this.mensaje.idUsuarioEnvio = this.usuario._id;
    this.mensaje._id = this.objDataChat.idUsuario;//id usuario que envia el mensaje
    this.mensaje._idEstablecimiento = this.objEstablecimiento._id;
    this.mensaje.msg = this.chatForm.get('messaje').value;
    this.mensaje.rol = this.usuario.rol;
    this.mensaje.nombre = this.usuario.nombre;
    this.mensaje.estadoMensaje = false;
    this.mensaje.cheked = false;
    this.mensaje.categoria = this.selectedCategory._id;
    this.mensaje.nombreCategoria = this.selectedCategory.name;
    this.mensaje.criticidad = this.selectedCategory.criticity;
  }

  getTokenNotification(title, mesaje){
    this.db.object('/UsersTokenMovile/'+this.infoInmueble.id_establecimiento+'/'+this.infoInmueble._id+'/'+this.objDataChat.idUsuario).valueChanges().subscribe(token =>{
      this.notification.title = title;
      this.notification.body = mesaje;

      if(token){
        this.sendNotification(this.notification, token);
      }else{
        Swal.fire({
          title: 'Advertencia',
          text: 'Es posible que el usuario al que le estas tratando de enviar el mensaje, no tenga la app movil, por tanto no podemos enviar el mensaje.',
          icon: 'warning'
        })
      }
      this.cargando = false;
    })
  }

  sendNotification(notification, to){
    this.notificationService.sendNotification(notification,to).subscribe(result => {
    },error => {
    })
  }




}
