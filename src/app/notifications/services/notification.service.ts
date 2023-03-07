import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NotificationService {

  constructor(
              private http: HttpClient) { 
              }

  sendNotification(body,to): Observable<any>{    
    localStorage.setItem('tokenNotify', environment.keyNotification);
    let message = {
      notification: {
        title : body.title,
        body: body.body,
        sound : "default"
      },
      to: to,
      data:{
        type:3
      }
    } 
    return this.http.post<any>(environment.urlNotificationPost, message);
  }


  sendNotificationAllUsersByStableshment(title,to,body): Observable<any>{   
    localStorage.setItem('tokenNotify', environment.keyNotification);
    
    let message = {
      notification: {
        title : title,
        body: body,
        sound : "default"
      },
      to: to,
      data:{
        //cartelera = 1
        //noticia = 2
        //chat = 3        
        type: 1
      }
    }   
    return this.http.post<any>(environment.urlNotificationPost, message);
  }


}
