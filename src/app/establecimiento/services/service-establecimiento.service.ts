import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericResponse } from 'src/utils/models/Business';

@Injectable({
  providedIn: 'root'
})
export class ServiceEstablecimientoService {

  constructor(private http: HttpClient) { }

  getEstablecimientos(): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.user + environment.establecimientos);
  }

  getOptions(): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.user + environment.options);
  }

  updateEstableciemiento(establecimiento): Observable<any>{
    return this.http.post(environment.url + environment.establecimiento + environment.update, establecimiento);
  }

  getUser(idUsuario): Observable<any>{
    return this.http.get(environment.url + environment.neighbor + '/getByUserId' + '/' + idUsuario);
  }

  getRol(): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.user + environment.getRole );
  }

  getPermisos(idopcion): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.permission + environment.getPermissionsByOption + '/' + idopcion);
  }
}
