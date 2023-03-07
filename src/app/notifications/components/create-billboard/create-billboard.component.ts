import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillboardService } from '../../services/billboard.service';
import { Billboard } from 'src/utils/models/notifications/cartelera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotificationService } from '../../services/notification.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-create-billboard',
  templateUrl: './create-billboard.component.html',
  styleUrls: ['./create-billboard.component.scss']
})
export class CreateBillboardComponent implements OnInit {

  @Input() billboard: Billboard;
  carteleraForm: FormGroup;
  @Output() propagar = new EventEmitter<boolean>();
  cargando: boolean = false;
  file: File;
  public Editor = ClassicEditor;

  lisTokens = [];
  tokens = [];
  tokens2 = [];

  image;

  constructor(private billboardService: BillboardService,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.cargando = true;
    if (this.billboard._id) {
      let importante;
      if (this.billboard.is_important == "true") {
        importante = true;
      } else {
        importante = false;
      }
      console.log('this.billboard.images', this.billboard.images);
      
      if (this.billboard.images > 0) {
        this.carteleraForm = this.formBuilder.group({
          title: [this.billboard.title, Validators.required],
          images: [this.billboard.images[0].image],
          description: [this.billboard.description, Validators.required],
          start_date: [this.billboard.start_date],
          end_date: [this.billboard.end_date],
          author: [this.billboard.author, Validators.required],
          _id: [this.billboard._id],
          state: ['Activo'],
          link: [this.billboard.link],
          id_establishment: [this.billboard.id_establishment],
          btn_text: [this.billboard.btn_text],
          type: 'C',
          is_important: [importante]
        });
      } else {
        this.carteleraForm = this.formBuilder.group({
          title: [this.billboard.title, Validators.required],
          images: [],
          description: [this.billboard.description, Validators.required],
          start_date: [this.billboard.start_date],
          end_date: [this.billboard.end_date],
          author: [this.billboard.author, Validators.required],
          _id: [this.billboard._id],
          state: ['Activo'],
          link: [this.billboard.link],
          id_establishment: [this.billboard.id_establishment],
          btn_text: [this.billboard.btn_text],
          type: 'C',
          is_important: [importante]
        });
      }

      this.cargando = false;
    } else {
      this.carteleraForm = this.formBuilder.group({
        title: ['', Validators.required],
        images: [''],
        description: [''],
        start_date: ['', Validators.required],
        author: ['', Validators.required],
        end_date: [''],
        state: ['Activo'],
        link: [''],
        id_establishment: [this.billboard.id_establishment],
        btn_text: [''],
        type: 'C',
        is_important: [false]
      });
      this.cargando = false;
    }
  }


  guardar() {
    this.carteleraForm.markAllAsTouched();
    this.carteleraForm.updateValueAndValidity();

    
    const formulario = this.carteleraForm.value;
    this.cargando = true;
    let images: Array<String>;
    if (formulario.images.length == 0) {
      images = new Array();
      this.carteleraForm.get('images').setValue(images);
    } else {
      this.carteleraForm.get('images').setValue(formulario.images);
    }

    this.billboardService.saveBillboard(this.carteleraForm.value).subscribe(Response => {
      this.cargando = false;
      Swal.fire({
        html: `
          <div class="alert__container">
            <div class="alert__header header__success"></div>
            <div class="alert__content">
              <h4 class="alert__title title__success">
                Publicas carteleras más
                <br>
                rápido que Flash
              <h4>
                <p class="alert__description">
                Gracias a ti, todos estarán enterados de los
                <br>
                eventos más importantes y como te quedaron
                <br>
                tan bonitas nadie se los querrá perder.
                </p>
            </div>
          </div>`,
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonText: 'Mira cómo quedó',
        confirmButtonText: 'Quiero publicar otra',
      }).then((result) => {
        if (result.value) {
          this.carteleraForm = this.formBuilder.group({
            title: ['', Validators.required],
            images: [],
            description: ['', Validators.required],
            start_date: ['', Validators.required],
            author: ['', Validators.required],
            end_date: ['', Validators.required],
            state: ['Activo'],
            link: [''],
            btn_text: [''],
            is_important: [],
            type: 'C',
            id_establishment: [this.billboard.id_establishment]
          });
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
                  Esta cartelera está como chueca
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
  }



  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      if (this.file.size > 3000000) {
        Swal.fire({
          title: 'Error.',
          text: 'Estas tratando de cargar una imagen mayor a 2.5 MB.',
          icon: 'error',
          confirmButtonText: 'ok',
          confirmButtonColor: '#3DB5FF'
        });
        this.carteleraForm.get('images').setValue('');
      } else {
        this.onFileChange(event);
      }
    }
  }

  uploadFile() {
    if (this.billboard.images) {
      this.image = this.billboard.images;
      this.carteleraForm.get('images').setValue(this.image);
    }
    if (this.file) {
      if (this.carteleraForm.valid) {
        const filePath = 'carteleras/' + this.billboard.id_establishment + '/' + this.file.name + Date.now();
        const fileRef = this.storage.ref(filePath);
        fileRef.put(this.file).then(() => {
          fileRef.getDownloadURL().subscribe(result => {
            this.carteleraForm.get('images').setValue([{ image: result }]);
            this.guardar();
          });
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: "Por favor ingresar todos los datos",
          icon: 'error',
          confirmButtonText: 'ok',
          confirmButtonColor: '#3DB5FF'
        });
      }
    } else {
      this.guardar();
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.carteleraForm.get('images').setValue(event.target.result);
      }
    }
  }

  onPropagar() {
    this.propagar.emit(true);
  }


  notifications() {
    this.db.list('/UsersTokenMovile/' + this.billboard.id_establishment).valueChanges().subscribe(result => {
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
        this.notificationService.sendNotificationAllUsersByStableshment('Nueva cartelera', element, 'Una cartelera nueva ha sido publicada').subscribe(response => {
        }, error => {
        })
      });
    }, 2500);
    this.onPropagar();
  }

  validaFechaFin() {
    if (this.carteleraForm.value.end_date < this.carteleraForm.value.start_date) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha fin no puede ser menor a la inicial',
        icon: 'error',
        confirmButtonText: 'ok',
        confirmButtonColor: '#3DB5FF'
      })
      this.carteleraForm.get('end_date').setValue('');
    }
  }
}
