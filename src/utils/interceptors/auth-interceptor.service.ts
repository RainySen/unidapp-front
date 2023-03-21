import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('tokenPaco');
        const tokenNotify: string = localStorage.getItem('tokenNotify');

    const decript = atob(token);

    if(tokenNotify){
      request = request.clone({headers: request.headers.set('Authorization', `${ tokenNotify }`)});
    }else{
      if (token) {
        request = request.clone({headers: request.headers.set('Authorization', `bearer ${ decript }`)});
      }
    }

    localStorage.removeItem('tokenNotify');

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
        return throwError( err );
      })
    );
  }
}