import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceAuthorizationService } from 'src/app/authorization/services/service-authorization.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: ServiceAuthorizationService, private router: Router){}

  canActivate(){
     if(this.authService.getCurrenUser()){
        return true;
     }
     else{
       this.router.navigate(['/login']);
       return false;
     }
  }

}
