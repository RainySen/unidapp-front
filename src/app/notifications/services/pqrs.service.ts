import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class PqrsService {

  constructor(
              private http: HttpClient) { 
              }


    getPqrs(idEstablishment): Observable<any>{
    return this.http.get<any>(environment.url + environment.pqrs + environment.getByEstablishment+'/'+idEstablishment);
    }  
    

}
