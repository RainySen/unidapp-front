import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Activos, tipoVehiculos, tipoMascota } from '../../../../utils/models/activos/activos';
import { ServiceVecinos } from '../../services/service-vecinos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-activo-view',
  templateUrl: './activo-view.component.html',
  styleUrls: ['./activo-view.component.scss']
})
export class ActivoViewComponent implements OnInit {

  activosForm: FormGroup;
  listado = true;
  @Input() objEditarActivo;
  @Input() idEstablecimiento;
  @Output() propagar = new EventEmitter<boolean>();
  objActivo: Activos[];
  mostrarCuartoUtil: boolean = false;
  mostrarVehiculo: boolean = false;
  mostrarCelda: boolean = false;
  mostrarMascota: boolean = false;

  respuestaEdicionActivo;

  cuartos;
  vehiculos;
  celdas;
  mascotas;
  coeficiente;
  numerofijo;


  constructor(private fb: FormBuilder,
    private servicio: ServiceVecinos) { }

  ngOnInit(): void {

    this.activosForm = this.fb.group({
      num_inmueble: [this.objEditarActivo.num_inmueble, [Validators.required, Validators.minLength(5)]],
      numero_fijo: [this.objEditarActivo.numero_fijo, [Validators.required]],
      coeficiente: [this.objEditarActivo.coeficiente, [Validators.required]],
      cuartosUtiles: this.fb.array([]),
      vehiculos: this.fb.array([]),
      mascotas: this.fb.array([]),
      celdas: this.fb.array([]),
      id_establecimiento: [this.idEstablecimiento]
    });
    setTimeout(() => {

    setTimeout(() => {
      this.addCuartosUtilesArray();
    }, 30);

    setTimeout(() => {
      this.addvehiculoArray();
    }, 30);

    setTimeout(() => {
      this.addceldaArray();
    }, 30);

    setTimeout(() => {
      this.addmascotaArray();
    }, 30);

    setTimeout(() => {
        if(this.activosForm.get('cuartosUtiles').value.length === 0){this.addCuartosUtiles();this.mostrarCuartoUtil=false;}
        if(this.activosForm.get('vehiculos').value.length === 0){this.addvehiculo();this.mostrarVehiculo=false;}
        if(this.activosForm.get('mascotas').value.length === 0){this.addmascota();this.mostrarMascota=false;}
        if(this.activosForm.get('celdas').value.length === 0){this.addcelda();this.mostrarCelda=false;}
    }, 90);

    }, 1500);

  }

  valida() {
    // this.cuartos = this.activosForm.get("cuartosUtiles").value.length == 0
    console.log('cuartos', this.cuartos, this.activosForm);

    // this.vehiculos = this.activosForm.get("vehiculos").value.length == 0
    // this.celdas = this.activosForm.get("celdas").value.length == 0
    // this.mascotas = this.activosForm.get("mascotas").value.length == 0
    //this.coeficiente = this.activosForm.get("coeficiente").invalid
    //this.numerofijo = this.activosForm.get("numero_fijo").invalid

    if (this.coeficiente && this.numerofijo) {
      Swal.fire({
        title: 'error',
        text: 'Aún tienes campos por llenar',
        icon: 'error'
      })
    } else {
      console.log('entra a guardar?');

      this.guardar();
    }
  }

  get cuartosUtiles() {
    return this.activosForm.get('cuartosUtiles') as FormArray;
  }

  get vehiculo() {
    return this.activosForm.get('vehiculos') as FormArray;
  }

  get celda() {
    return this.activosForm.get('celdas') as FormArray;
  }

  get mascota() {
    return this.activosForm.get('mascotas') as FormArray;
  }


  addCuartosUtilesArray() {
    if (this.objEditarActivo.cuartosUtiles != null) {
      for (let i = 0; i < this.objEditarActivo.cuartosUtiles.length; i++) {
        this.cuartosUtiles.push(
          this.fb.group({
            nomenclaturaCuartoUtil: [this.objEditarActivo.cuartosUtiles[i].nomenclaturaCuartoUtil, [Validators.required]],
          })
        );
      }
    }
    if (this.cuartosUtiles.length > 0) { this.mostrarCuartoUtil = true; }
  }

  addvehiculoArray() {
    if (this.objEditarActivo.vehiculos != null) {
      for (let i = 0; i < this.objEditarActivo.vehiculos.length; i++) {
        this.vehiculo.push(
          this.fb.group({
            tipoVehiculo: [this.objEditarActivo.vehiculos[i].tipoVehiculo, [Validators.required]],
            descripcion: [this.objEditarActivo.vehiculos[i].descripcion, [Validators.required]]
          })
        );
      }
    }
    if (this.vehiculo.length > 0) { this.mostrarVehiculo = true; }

  }

  addceldaArray() {
    if (this.objEditarActivo.celdas != null) {
      for (let i = 0; i < this.objEditarActivo.celdas.length; i++) {
        this.celda.push(
          this.fb.group({
            numero: [this.objEditarActivo.celdas[i].numero, [Validators.required]]
          })
        );
      }
    }
    if (this.celda.length > 0) { this.mostrarCelda = true; }

  }

  addmascotaArray() {
    if (this.objEditarActivo.mascotas != null) {
      for (let i = 0; i < this.objEditarActivo.mascotas.length; i++) {
        this.mascota.push(
          this.fb.group({
            tipoMascota: [this.objEditarActivo.mascotas[i].tipoMascota, [Validators.required]],
            descripcion: [this.objEditarActivo.mascotas[i].descripcion, [Validators.required]]
          })
        );
      }
    }
    if (this.mascota.length > 0) { this.mostrarMascota = true; }
  }

  addCuartosUtiles() {
    this.cuartosUtiles.push(
      this.fb.group({
        nomenclaturaCuartoUtil: ['', [Validators.required]]
      })
    );
  }


  addvehiculo() {
    this.vehiculo.push(
      this.fb.group({
        tipoVehiculo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]]
      })
    );
  }

  addcelda() {
    this.celda.push(
      this.fb.group({
        numero: ['', [Validators.required]]
      })
    );
  }


  addmascota() {
    this.mascota.push(
      this.fb.group({
        tipoMascota: ['', [Validators.required]],
        descripcion: ['', [Validators.required]]
      })
    );
  }

  deleteCuartoUtil(index) {
    this.cuartosUtiles.removeAt(index);
  }

  deleteVehiculo(index) {
    this.vehiculo.removeAt(index);
  }

  deleteCelda(index) {
    this.celda.removeAt(index);
  }

  deleteMascota(index) {
    this.mascota.removeAt(index);
  }

  cancel() {
    this.propagar.emit(true);
  }


  accion(num) {
    if (num == 1) { this.mostrarCuartoUtil = !this.mostrarCuartoUtil; }
    if (num == 2) { this.mostrarVehiculo = !this.mostrarVehiculo; }
    if (num == 3) { this.mostrarMascota = !this.mostrarMascota }
    if (num == 4) { this.mostrarCelda = !this.mostrarCelda; }

  }
  cam: any
  guardar() {

    this.cam = this.activosForm.get("cuartosUtiles").value;
    console.log('si guarda realametne?', this.cam);

    if (this.cam > 0) {
      this.cam.forEach(element => {

        console.log(this.cam);

        if (!this.cam.includes(element)) {
          console.log(element);

          Swal.fire({
            title: 'Datos repetidos',
            text: "Verifique sus datos ya que posee algunos repetidos",
            icon: "error",
          });
        } else
          this.servicio.editarActivo(this.activosForm.value).subscribe(Response => {
            this.respuestaEdicionActivo = Response;

            Swal.fire({
              title: 'Actualización exitosa',
              text: 'El inmueble ' + this.objEditarActivo.num_inmueble + ' ha sido actualizado',
              icon: "success",
            });
            this.cancel();
          }, error => {
            this.respuestaEdicionActivo = error;
            Swal.fire({
              title: 'Algo salió mal',
              text: error.error.answer,
              icon: "error",
            });
          });
      });
    } else {
      this.servicio.editarActivo(this.activosForm.value).subscribe(Response => {
        this.respuestaEdicionActivo = Response;

        Swal.fire({
          title: 'Actualizaciòn exitosa',
          text: 'El activo ' + this.objEditarActivo.num_inmueble + ' ha sido actualizado',
          icon: "success",
        });
        this.cancel();
      }, error => {
        this.respuestaEdicionActivo = error;
        Swal.fire({
          title: 'Algo salió mal',
          text: error.error.answer,
          icon: "error",
        });
      });
    }



  }
}
