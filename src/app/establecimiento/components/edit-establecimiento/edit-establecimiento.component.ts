import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServiceEstablecimientoService } from '../../services/service-establecimiento.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Permissions } from 'src/utils/models/User';
import swal from 'sweetalert2';

import { AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-establecimiento',
  templateUrl: './edit-establecimiento.component.html',
  styleUrls: ['./edit-establecimiento.component.scss']
})
export class EditEstablecimientoComponent implements OnInit {
num = 1;
@Input() establecimientoInfo;
@Input() listadoVecinos: boolean;
@Input() opcion;

rol: string;
permisos: Permissions = new Permissions;

establecimiento: FormGroup;

file: File;
filePath: string;

  constructor(private formBuilder: FormBuilder,
              private cookie: CookieService,
              private storage: AngularFireStorage,
              private servicio: ServiceEstablecimientoService) { }

  ngOnInit(): void {
    this.establecimiento = this.formBuilder.group({
      cod_establec: [this.establecimientoInfo.cod_establec, [Validators.required]],
      nom_establec: [this.establecimientoInfo.nom_establec, [Validators.required]],
      tipo_establec: [this.establecimientoInfo.tipo_establec, [Validators.required]],
      celular: [this.establecimientoInfo.celular, [Validators.required]],
      correo: [this.establecimientoInfo.correo, [Validators.required]],
      direccion: [this.establecimientoInfo.direccion, [Validators.required]],
      nom_corto_establec: [this.establecimientoInfo.nom_corto_establec, [Validators.required]],
      telefono: [this.establecimientoInfo.telefono, [Validators.required]],
      _id: [this.establecimientoInfo._id],
      nom_administrador: [this.establecimientoInfo.nom_administrador],
      estado: [this.establecimientoInfo.estado],
      creado_e: [this.establecimientoInfo.creado_e],
      actualizado_e: [this.establecimientoInfo.actualizado_e],
      ruta_imagen_establ: [this.establecimientoInfo.ruta_imagen_establ],
    });
    this.obtenerPermisos();
  }

  updateEstablecimiento(){
    this.establecimiento.get('actualizado_e').setValue(Date.now);
    this.servicio.updateEstableciemiento(this.establecimiento.value).subscribe(Response => {
      Swal.fire({
        title: 'Editaste el establecimiento.',
        text: 'La edición ha sido correcta.',
        icon: 'success'
      }).then((result) => {
        if (result.value) {
          window.location.reload();          
        }
      });      
    });
  }

  pasos(num){
    this.num = num;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      if(this.file.size > 3000000){
        swal.fire({
          title: 'Error.',
          text: 'estas tratando de cargar una imagen mayor a 2.8 MB.',
          icon: 'error'
        });
        this.establecimiento.get('ruta_imagen_establ').setValue('');
      }else{
        this.onFileChange(event);
      }
    }
  }

  uploadFile() {
    this.filePath = this.establecimiento.get('ruta_imagen_establ').value;
    if(this.file){
      this.filePath = 'establecimientoInfo/'+this.establecimientoInfo._id+'/'+this.file.name;
      const fileRef = this.storage.ref(this.filePath);
      fileRef.put(this.file).then(() => {
        fileRef.getDownloadURL().subscribe(result => {
          this.establecimiento.get('ruta_imagen_establ').setValue(result);
          this.updateEstablecimiento();
        });
      });
    }else{
      this.updateEstablecimiento();
    }
  }

  onFileChange(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.establecimiento.get('ruta_imagen_establ').setValue(event.target.result);
      }
    }
  }

  obtenerPermisos(){
    this.servicio.getPermisos(this.opcion._id).subscribe(Response => {
      this.rol = JSON.parse(atob(this.cookie.get('rol')));
      Response.genericObject.forEach(element => {
        if(element.id_rol == this.rol){
          this.permisos = element;
        }
      });
    },error => {
      swal.fire({
        title: 'Advertencia',
        html: "El usuario no posee permisos para ingresar a este modulo.",
        icon: 'info'
      });
    });
  }
}
