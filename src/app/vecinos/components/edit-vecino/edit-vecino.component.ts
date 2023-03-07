import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceVecinos } from '../../services/service-vecinos.service';
import { EditarVecino } from 'src/utils/models/vecinos/editVecino';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-edit-vecino',
  templateUrl: './edit-vecino.component.html',
  styleUrls: ['./edit-vecino.component.scss']
})
export class EditVecinoComponent implements OnInit {

  @Input() objEditarVecino: EditarVecino;
  @Input() idEstablecimiento;
  @Output() propagar = new EventEmitter<boolean>();

  editarVecino: FormGroup;
  generoOtro = false;
  respuestaEditar;
  file: File;
  cargando: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private servicio: ServiceVecinos) { }

  ngOnInit(): void {
    this.editarVecino = this.formBuilder.group({
      _id: [this.objEditarVecino.neighbor._id],
      id_usuario: [this.objEditarVecino.neighbor.id_usuario],
      nombres: [this.objEditarVecino.neighbor.nombres, [Validators.required]],
      apellidos: [this.objEditarVecino.neighbor.apellidos, [Validators.required]],
      fecha_nacimiento: [this.objEditarVecino.neighbor.fecha_nacimiento],
      tipo_doc: [this.objEditarVecino.neighbor.tipo_doc , [Validators.required]],
      identificacion: [this.objEditarVecino.neighbor.identificacion, [Validators.required]],
      numero_celular: [this.objEditarVecino.neighbor.numero_celular, [Validators.required]],
      email: [this.objEditarVecino.email, [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+([.]+[a-zA-Z]{2,6}){1,3})')]],
      estado: [this.objEditarVecino.neighbor.estado],
      sexo: [this.objEditarVecino.neighbor.sexo, [Validators.required]],
      num_inmueble: [this.objEditarVecino.num_inmueble],
      foto: [this.objEditarVecino.neighbor.foto]
    });
  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      if(this.file.size > 3000000){
        Swal.fire({
          title: 'Error.',
          text: 'estas tratando de cargar una imagen mayor a 2.5 MB.',
          icon: 'error'
        });
        this.editarVecino.get('foto').setValue('');
      }else{
        this.onFileChange(event);
      }
    }
  }

  onFileChange(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.editarVecino.get('foto').setValue(event.target.result);
      }
    }
  }

  uploadFile() {
    if(this.file){
      const filePath = 'vecinoInfo/'+this.idEstablecimiento+'/'+this.objEditarVecino.neighbor._id+this.file.name;
    const fileRef = this.storage.ref(filePath);
    fileRef.put(this.file).then(() => {
      fileRef.getDownloadURL().subscribe(result => {
        this.editarVecino.get('foto').setValue(result);
      });
    });
    setTimeout(() => {
      this.guardar();
    }, 1500);
    }
    this.guardar();
  }


  guardar(){
    this.cargando = true;
    this.servicio.editarVecino(this.editarVecino.value).subscribe(Response => {
      this.respuestaEditar = Response;
      this.cargando = false;
      Swal.fire({
        title: 'Usuario creado correctamente',
        text: 'El usuario ' + this.objEditarVecino.neighbor.nombres +
         ' ' + this.objEditarVecino.neighbor.apellidos + ' ha sido actualizado',
        icon: 'success',
      });
      this.onPropagar();
    }, error => {
      this.cargando = false;
      Swal.fire({
        title: 'Algo salió mal',
        text: error.error.answer,
        icon: 'error',
      });
      this.respuestaEditar = error;
    });
  }

  generoOtroMetodo(){
    const respuesta = this.editarVecino.get('sexo').value;
    if(respuesta == 'otro'){
      this.generoOtro = true;
    }
  }

  onPropagar() {
    this.propagar.emit(true);
  }
}
