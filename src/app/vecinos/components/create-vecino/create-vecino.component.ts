import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Usuario, usuarioService, objEditUser } from 'src/utils/models/usuario/users';
import { ServiceVecinos } from '../../services/service-vecinos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-vecino',
  templateUrl: './create-vecino.component.html',
  styleUrls: ['./create-vecino.component.scss']
})
export class CreateVecinoComponent implements OnInit {

  @Input() idEstablecimiento;
  @Input() objUsuario: objEditUser;
  @Output() propagar = new EventEmitter<boolean>();
  Usuario: FormGroup;
  objCrear: Usuario = new Usuario();
  cargando;

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceVecinos
    ) {}

  ngOnInit(): void {
    this.cargando = true;
    if(this.objUsuario){
      this.Usuario = this.formBuilder.group({
        id_establecimiento: [this.idEstablecimiento],
        Email: [this.objUsuario.user.email, [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z]{2,6})')]],
        Nombres: [this.objUsuario.neighbor.nombres, [Validators.required]],
        Apellidos: [this.objUsuario.neighbor.apellidos],
        estado: ['Activo'],
        _id: [this.objUsuario.user._id],
        inmuebles: this.formBuilder.array([])
      });
      if(this.objUsuario.ureList.length > 0){
        this.addinmuebleArray();
      }
    }else{
      this.Usuario = this.formBuilder.group({
        id_establecimiento: [this.idEstablecimiento],
        Email: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z]{2,6})')]],
        Nombres: ['', [Validators.required]],
        Apellidos: [''],
        estado: ['Activo'],
        inmuebles: this.formBuilder.array([])
      });
    }
    this.cargando = false;
    this.addinmueble();
  }

  get inmuebles() {
    return this.Usuario.get('inmuebles') as FormArray;
  }

  addinmuebleArray() {
      for (let i = 0; i < this.objUsuario.ureList.length; i++) {
        this.inmuebles.push(
          this.formBuilder.group({
            num_inmueble: [this.objUsuario.ureList[i].num_inmueble, [Validators.required]],
            estado: [this.objUsuario.ureList[i].estado, [Validators.required]],
            ureId: [this.objUsuario.ureList[i]._id]
          })
          );
        }
    }

  addinmueble() {
    this.inmuebles.push(
      this.formBuilder.group({
        num_inmueble: ['', [Validators.required]],
        estado: ['A', [Validators.required]]
      })
    );
  }

  crear(){
    if(!this.Usuario.valid){
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Porfavor verifica el formulario y completalos campos obligatorios (*)',
        icon: 'warning',
      });
    }else{

      this.cargando = true;
      this.objCrear.user = new usuarioService();
      if(this.objUsuario){
        this.objCrear.user._id =   this.objUsuario.neighbor.id_usuario;
      }
      this.objCrear.user.email = this.Usuario.get('Email').value;
      this.objCrear.user.nombres = this.Usuario.get('Nombres').value;
      this.objCrear.user.apellidos = this.Usuario.get('Apellidos').value;
      this.objCrear.inmuebles = this.inmuebles.value;
      this.objCrear.id_establecimiento = this.Usuario.get('id_establecimiento').value;
      this.service.crearUsuario(this.objCrear).subscribe(Response => {
        Swal.fire({
          title: 'Creacion correcta',
          text: 'Usuario creado correctamente',
          icon: 'success',
        });
        this.cargando = false;
        this.onPropagar();
      }, error => {
        this.cargando = false;
        Swal.fire({
          title: 'Algo salió mal',
          text: error.error.answer,
          icon: 'error',
        });
      });

    }
  
  }


  onPropagar() {
    this.propagar.emit(true);
  }

  deleteInmueble(index) {
    this.inmuebles.removeAt(index);
  }

}
