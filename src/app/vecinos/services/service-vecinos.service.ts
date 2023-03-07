import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericResponse } from 'src/utils/models/Business';


@Injectable({
  providedIn: 'root'
})
export class ServiceVecinos {

  constructor(private http: HttpClient) { }


  obtenerVecinos(idEstablecimiento): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.vecino + environment.vecinoPorEstablecimiento +'/'+ idEstablecimiento);
  }

  obtenerActivos(nomenClatura, idEstablecimiento): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.asset + environment.getByNum_interno + '/' + idEstablecimiento + '/' + nomenClatura)
  }

  obtenerInmueblesVecino(idVecino){
    return this.http.get<GenericResponse>(environment.url + environment.neighbor + '/get/' + idVecino);
  }

  crearUsuario(objUsuario): Observable<GenericResponse>{
    return this.http.post<GenericResponse>(environment.url + environment.user + environment.saveUser, objUsuario);
  }

  editarVecino(objVecino): Observable<GenericResponse>{
    return this.http.post<GenericResponse>(environment.url + environment.neighbor + environment.saveNeighbor, objVecino);
  }

  editarActivo(objActivo): Observable<GenericResponse>{
    return this.http.post<GenericResponse>(environment.url + environment.asset + environment.saveAsset, objActivo);
  }

  getPermisos(idopcion): Observable<GenericResponse>{
    return this.http.get<GenericResponse>(environment.url + environment.permission + environment.getPermissionsByOption + '/' + idopcion);
  }

  // eliminarUsuario(idEstablecimiento,idUsuario, num_inmueble): Observable<GenericResponse> {
  //   return this.http.delete<GenericResponse>(environment.url + environment.neighbor + environment.unassociateAsset + '/' + idEstablecimiento +'/' + idUsuario+ '/' + num_inmueble)
  // }

   eliminarUsuario(idEstablecimiento,idUsuario, num_inmueble): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(environment.url + environment.neighbor + environment.delete + '/' + idUsuario)
  }

}
