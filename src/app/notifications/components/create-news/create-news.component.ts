import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';
import Swal from 'sweetalert2';
import { News } from '../../../../utils/models/notifications/news';
import { BillboardService } from '../../services/billboard.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/utils/models/User';
import { Subject } from 'rxjs';


import { AngularFireDatabase } from '@angular/fire/database';
import { NotificationService } from '../../services/notification.service';

import * as _moment from 'moment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {

  @Input() new: News;
  noticiasForm: FormGroup;

  @Output() propagar = new EventEmitter<boolean>();
  @Input() objEstablecimiento: Establecimiento;
  cargando = false;
  file: File;
  arrayImagenes: any[] = [];
  User: User;
  respuesta;
  requests$ = new Subject<any[]>();
  edicion=false;
  fuenteFinal:HTMLImageElement;

  moment = _moment;

  lisTokens = [];
  tokens = [];
  tokens2 = [];

  public Editor = ClassicEditor;

  contenidoPlaceholder = 'Escribe aquí una descripción que haga que esta experiencia nadie se la quiera perder';

  constructor(private billboardService: BillboardService,
    private notificationService: NotificationService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder) {
    setTimeout(() => {
      this.addImagenesArray();
    }, 30);

  } 

  ngOnInit(): void {
    if (this.new._id) {
      this.noticiasForm = this.formBuilder.group({
        title: [this.new.title, Validators.required],
        images: this.formBuilder.array([]),
        description: [this.new.description, Validators.required],
        start_date: [this.new.start_date, Validators.required],
        end_date: [this.new.end_date],
        author: [this.new.author, Validators.required],
        btn_text: [this.new.btn_text],
        link: [this.new.link],
        state: ['Activo'],
        type: 'N',
        _id: [this.new._id],
        id_establishment: [this.objEstablecimiento._id]
      });
      this.cargando = false;
    } else {
      this.noticiasForm = this.formBuilder.group({
        title: ['', Validators.required],
        images: this.formBuilder.array([]),
        description: ['', Validators.required],
        start_date: [''],
        end_date: [''],
        author: ['', Validators.required],
        state: ['Activo'],
        link: [''],
        btn_text: [''],
        type: 'N',
        id_establishment: [this.objEstablecimiento._id]
      });
      this.cargando = false;
    }

    if (!this.new.images) {
      for (let i = 0; i < 4; i++) {
        this.addImages();
      }
    }
    else
    {
      var imagesOfArray= this.new.images.length;
      for (let i = imagesOfArray; i < 4; i++) {
        console.log(i);
        this.addImages();
      }
    }
    if (this.new._id) {
      this.arrayImagenes = this.new.images;
      console.log(this.arrayImagenes);
    }

    console.log(this.noticiasForm.value);
    
  }

  imageInsert(index)
  {
    var imagen=document.getElementById('selectImagen'+index).click();
    console.log(imagen);
    
    this.edicion=true;
  }

  get imagenes() {
    return this.noticiasForm.get('images') as FormArray;
  }

  addImagenesArray() {
    if (this.new.images != null) {
      for (let i = 0; i < this.new.images.length; i++) {
        this.imagenes.push(
          this.formBuilder.group({
            image: [this.new.images[i].image]
          })
        );
      }
    }
  }

  sourceImage(index)
  {
    if(!this.new.images)
    {
      var fuente=this.arrayImagenes[index];
      return fuente;
    }
    else
    {
      if(this.edicion==true)
      {
        var fuente=this.arrayImagenes[index];
        return this.arrayImagenes[index];
      }
      else
      {
        console.log(this.arrayImagenes[index].image.image.image.image);
        
        var fuente=this.arrayImagenes[index].image.image.image.image;
        //console.log('entro al no editar');
        return fuente;
      }

    }

  }

  deleteImages(index) {
    this.imagenes.removeAt(index);
  }

  addImages() {
    this.imagenes.push(
      this.formBuilder.group({
        image: ['']
      })
    );
  }

  guardar() {

      this.noticiasForm.markAllAsTouched();
      this.noticiasForm.updateValueAndValidity();
  
  
      this.cargando = true;
      if (this.noticiasForm.get('start_date').value == '' || this.noticiasForm.get('start_date').value == 'null') {
        this.noticiasForm.get('start_date').setValue(this.moment().format('DD/MM/YYYY HH:mm'));
      }
  
      this.imagenes.clear();
      this.arrayImagenes.forEach(element => {
        this.imagenes.push(
          this.formBuilder.group({
            image: [element, [Validators.required]]
          })
        );
      });


      setTimeout(() => {
        if (this.noticiasForm.valid) {
          this.billboardService.saveBillboard(this.noticiasForm.value).subscribe(Response => {
  
            this.cargando = false;
            Swal.fire({
              html: `
              <div class="alert__container">
                <div class="alert__header header__success"></div>
                <div class="alert__content">
                  <h4 class="alert__title title__success">
                    Publica noticias más
                    <br>
                    rápido que Flash
                  <h4>
                    <p class="alert__description">
                      Eres el mejor reportero de todos,
                      <br>
                      esa noticia te quedo una maravisha
                    </p>
                </div>
              </div>`,
              reverseButtons: true,
              showCancelButton: true,
              cancelButtonText: 'Mira cómo quedó',
              confirmButtonText: 'Quiero publicar otra',
            }).then((result) => {
              if (result.value) {
                
                  this.noticiasForm = this.formBuilder.group({
                    title: ['', Validators.required],
                    images: this.formBuilder.array([]),
                    description: ['', Validators.required],
                    start_date: [''],
                    author: ['', Validators.required],
                    end_date: [''],
                    state: ['Activo'],
                    btn_text: [''],
                    link: [''],
                    type: 'N',
                    id_establishment: [this.objEstablecimiento._id]
                  });
                  
                    for (let i = 0; i < 4; i++) {
                      this.addImages();
                    }
  
              } else {
                this.notifications();
              }
            });
          }, error => {
            this.cargando = false;
            Swal.fire({
              html: `
                <div class="alert__container">
                  <div class="alert__header header__error"></div>
                  <div class="alert__content">
                    <h4 class="alert__title title__error">
                      Esta notica está como chueca
                      <br>
                      porque no la pudimos publicar
                    <h4>
                      <p class="alert__description">
                        No te preocupes, todo saldra bien, ya
                        <br>
                        llamamos a Clark Kent para que la arregle.
                        <br>
                        Si quieres puedes echarle una ojeadita y le
                        <br>
                        ayudemos a Super man a publicarla ;)
                      </p>
                  </div>
                </div>`,
              showCancelButton: false,
              confirmButtonText: 'Ya mismo miro si me faltó algo',
            });
          });
        } else {
            
          Swal.fire({
            html: `
                <div class="alert__container">
                  <div class="alert__header header__error"></div>
                  <div class="alert__content">
                    <h4 class="alert__title title__error">
                      Upss!
                      <br>
                    <h4>
                      <p class="alert__description">
                        Parece que te faltan algunos campos por llenar
                      </p>
                  </div>
                </div>`,
            showCancelButton: false,
            confirmButtonText: 'Ya mismo miro si me faltó algo',
          });
          this.cargando = false;
        }
      }, 150);   
  }


  onFileSelect(event, position) {
    debugger
    let posicion=parseInt(document.getElementById('contador').innerHTML);
    console.log(posicion);
    this.file = event.target.files[0];
    if (this.file.size > 3000000) {
      Swal.fire({
        title: 'Error.',
        text: 'Estás tratando de cargar una imagen mayor a 2.5 MB.',
        icon: 'error'
      });
    } else {
      const filePath = 'noticias/' + this.objEstablecimiento._id + '/' + this.file.name + Date.now();
      const fileRef = this.storage.ref(filePath);
      fileRef.put(this.file).then(() => {
        fileRef.getDownloadURL().subscribe(result => {
          console.log(result);
          
          // if (this.new._id) {
            this.arrayImagenes[position] = result;
            console.log(this.new.images);
            
            var img = document.getElementById('img'+position);

            img.setAttribute('src',result);


          // } else {
          //   this.arrayImagenes.push(result);
          // console.log(this.arrayImagenes);

          // }
        });
      });
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.noticiasForm.get('images').setValue(event.target.result);
      }
    }
  }

  onPropagar() {
    this.propagar.emit(true);
  }

  notifications() {
    this.db.list('/UsersTokenMovile/' + this.objEstablecimiento._id).valueChanges().subscribe(result => {
      this.lisTokens = result
    }, error => {
    })
    setTimeout(() => {
      for (let i = 0; i < this.lisTokens.length; i++) {
        this.tokens2 = Object.values(this.lisTokens[i]);
        for (let j = 0; j < this.tokens2.length; j++) {
          const element = this.tokens2[j];
          this.tokens.push(element);
        }
      }
      this.tokens.forEach(element => {
        this.notificationService.sendNotificationAllUsersByStableshment('Nueva noticia', element, 'Una noticia nueva ha sido publicada').subscribe(response => {
        }, error => {
        })
      });
    }, 2500);
    this.onPropagar();
  }

  validaFechaFin() {
    if (this.noticiasForm.value.end_date < this.noticiasForm.value.start_date) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha fin no puede ser menor a la inicial',
        icon: 'error',
        confirmButtonText: 'ok',
        confirmButtonColor: '#3DB5FF'
      })
      this.noticiasForm.get('end_date').setValue('');
      return false;
    }else{
      return true
    }
  }

  validaFechaIni() {
    if (this.noticiasForm.value.end_date > this.noticiasForm.value.start_date) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha inicial no puede ser mayor a la final',
        icon: 'error',
        confirmButtonText: 'ok',
        confirmButtonColor: '#3DB5FF'        
      })
      this.noticiasForm.get('end_date').setValue('');
      return false;
    }else{
      return true
    }
  }

}


