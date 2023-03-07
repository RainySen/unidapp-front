import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Unidapp-Establecimiento';
  minutos: number;
  segundos: number;

  constructor( private router: Router,
               public translate: TranslateService,
               private coockie: CookieService){
                this.translate.setDefaultLang('es');
                this.translate.addLangs(['es', 'en']);
                this.resetTimer();
  }

  ngOnInit(): void {
    if (this.coockie.get('user')) {
      setInterval(() => this.tick(), 1000);
    }
  }

  resetTimer(): void {
    this.minutos = 0;
    this.segundos = 59;
    this.detener();
  }

  detener(){
    this.minutos = 5;
    this.segundos = 59;
  }

  private tick(): void{
    if (--this.segundos < 0) {
      this.segundos = 59;
      if (--this.minutos < 0) {
        this.minutos = 0;
        this.segundos = 59;
        localStorage.clear();
        sessionStorage.clear();
        this.coockie.deleteAll();
        this.router.navigate(['/login']);
      }
    }
  }
}
