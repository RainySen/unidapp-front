import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse } from 'src/utils/models/Business';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { AngularFireList, AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as _moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { userChat, msg, datachat } from 'src/utils/models/notifications/chat-notification';
import { FirebaseApp } from '@angular/fire';

@Injectable()
export class BillboardService {

  request: AngularFireList<any>;
  mensajesRequest: AngularFireObject<any>;
  mensaje: msg = new msg();
  objDataChat: datachat = new datachat();
  objDataMessage;
  moment = _moment;
  RolUser: any = 'user';
  rol: string;


  constructor(
    private cookie: CookieService,
    private db: AngularFireDatabase,
    private fire: FirebaseApp,
    private http: HttpClient) {
  }

  getRequestsByStore(idEstablecimiento): Observable<any[]> {
    this.request = this.db.list('/message/' + idEstablecimiento);
    this.request.valueChanges().subscribe(res => { })
    return this.request.valueChanges();
  }

  getRequestsByStoreAndUser(idEstablecimiento, userId): Observable<any[]> {
    this.mensajesRequest = this.db.object('/message/' + idEstablecimiento + '/' + userId);
    this.mensajesRequest.valueChanges().subscribe(res => { })
    return this.mensajesRequest.valueChanges();
  }

  getRequestsByAsset(idEstablecimiento, idUsuario): Observable<any[]> {
    this.request = this.db.list('/message/' + idEstablecimiento + '/' + idUsuario + '/conversacion');
    this.request.valueChanges().subscribe(res => { })

    return this.request.valueChanges();
  }

  sendMessage(mensaje: userChat) {
    mensaje.fecha = this.moment().format('DD/MM/YYYY HH:mm');
    this.mensaje.mensaje = mensaje.msg;
    this.mensaje.rolUsuario = mensaje.rol;
    this.mensaje.fechaMensaje = mensaje.fecha;
    this.mensaje.nombreUsuario = mensaje.nombre;
    this.mensaje.idUsuarioEnvio = mensaje.idUsuarioEnvio;
    this.mensaje.isDelete = false;
    if (mensaje.categoria) {
      this.mensaje.idCategoria = mensaje.categoria;
      this.mensaje.nombreCategoria = mensaje.nombreCategoria;
      this.mensaje.criticidad = Number(mensaje.criticidad);
    } else {
      this.mensaje.idCategoria = 0;
      this.mensaje.nombreCategoria = '';
      this.mensaje.criticidad = 0;
    };

    this.db.list('/message/' + mensaje._idEstablecimiento + '/' + mensaje._id + '/' + 'conversacion').push(this.mensaje);
  }

  newMessage(idEstablecimiento, objChat, objMensaje): any {
    this.objDataChat.fotoPerfil = objChat.fotoPerfil;
    this.objDataChat.nombreUsuario = objChat.nombreUsuario;
    this.objDataChat.numeroInmueble = objChat.numeroInmueble;
    this.objDataChat.idUsuario = objChat.idUsuario;
    var res;

    this.db.list('/message/' + idEstablecimiento + '/' + objChat.idUsuario).valueChanges().subscribe(response => {
      res = response;
    });

    setTimeout(() => {

      if (res.length > 0) {
        this.sendMessage(objMensaje);
      } else {
        this.db.database.ref('/message/' + idEstablecimiento + '/' + objChat.idUsuario).set(this.objDataChat).then(() => {
          this.sendMessage(objMensaje)
        });
      }
    }, 2500);

    return 'ok';

  }

  updateMessage(key: string, value: any, data) {
    this.db.list('/message/' + data.establishment + '/' + data.user + '/' + 'conversacion')
      .update(key,
        {
          criticidad: value.criticidad,
          fechaMensaje: value.fechaMensaje,
          idCategoria: value.idCategoria,
          idUsuarioEnvio: value.idUsuarioEnvio,
          isDelete: true,
          mensaje: value.mensaje,
          nombreCategoria: value.nombreCategoria,
          nombreUsuario: value.nombreUsuario,
          rolUsuario: value.rolUsuario,
        }).then(res => {
        })
  }

  async getListChat(establishmentId, userId) {
    let starCountRef = this.db.database.ref('/message/' + establishmentId + '/' + userId + '/' + 'conversacion');
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
    });
    return starCountRef;
  }

  getInmueble(idEstablecimiento): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(environment.url + environment.asset + environment.getByEstablishment + '/' + idEstablecimiento);
  }

  getUsers(idInmueble, IdEstablecimiento): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(environment.url + environment.neighbor + environment.getByAssetEstablishment + '/' + idInmueble + '/' + IdEstablecimiento);
  }

  deleteBillboard(idCartelera): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(environment.url + environment.newsletter + environment.delete + '/' + idCartelera);
  }

  getBillboard(idEstablecimiento, isBillboard): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.newsletter +
      environment.getByEstablishment + '/' + idEstablecimiento, isBillboard);
  }

  saveBillboard(objBillboard): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.newsletter + environment.saveNewsletter, objBillboard);
  }

  getPermisos(idopcion): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(environment.url + environment.permission + environment.getPermissionsByOption + '/' + idopcion);
  }

  getNews(idEstablecimiento, isNews): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.newsletter + environment.getByEstablishment + '/' + idEstablecimiento, isNews);
  }

  deleteNew(idNews): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(environment.url + environment.newsletter + environment.delete + '/' + idNews);
  }

  createCategory(category): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.category + environment.saveCategory, category);
  }

  getCategory(idEstablecimiento): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(environment.url + environment.category + environment.getByEstablishment + '/' + idEstablecimiento)
  }


}
