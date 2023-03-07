import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';
import { GenericResponse } from 'src/utils/models/Business';
import { UserPassword } from 'src/utils/models/usuario/password';

@Injectable({
  providedIn: 'root'
})
export class ServiceAuthorizationService {

  constructor(private http: HttpClient) { }

  postCredentials(credential): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.autenticacion, credential);
  }

  getUsers(): Observable<any[]>{
    return this.http.get<any>(environment.url + environment.usuarios);
  }

  getCurrenUser():boolean{
    let user_string = localStorage.getItem('tokenPaco');
    if (!isNullOrUndefined(user_string)) {
      return true;
    } else {
      return false;
    }
  }
  restorePassword(email): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.autenticacion + environment.restorePassword, email);
  }

  changePassword(ObjPassword): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.autenticacion + environment.changePassword, ObjPassword);
  }

  changePasswordUser(password: UserPassword): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(environment.url + environment.user + environment.changePassword, password);
  }

}
