import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PqrsService } from '../../services/pqrs.service';


@Component({
  selector: 'app-list-pqrs',
  templateUrl: './list-pqrs.component.html',
  styleUrls: ['./list-pqrs.component.scss']
})
export class ListPqrsComponent implements OnInit {

  @Input() listadoVecinos: boolean;
  @Input() objEstablecimiento;
  @Input() opcion;
  @Output() nombreMenu = new EventEmitter<string>();



  listado:any[] = [];
  listPqrs;
  listPqrsFilter;

  cargando: boolean = false;

  filtro: FormGroup;

  compareDes = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  compareAsc = (v1: string, v2: string) => v1 > v2 ? -1 : v1 < v2 ? 1 : 0;

  constructor(private formBuilder: FormBuilder,
              private service: PqrsService) {
   }

  ngOnInit(): void {
    this.cargando = true
    this.filtro = this.formBuilder.group({
      filtroNombre: [''],
      filtroEstado: ['',Validators.maxLength(1)]
    });
    this.getListPqrs()
  }


  orderBy(num){
    if(num == 1){
      this.listPqrsFilter = [...this.listPqrsFilter].sort((a, b) => {
        const res = this.compareDes(`${a.neighbor.nombres.toLowerCase()}`, `${b.neighbor.nombres.toLowerCase()}`);
        return res;
        });
    }
    if(num == 2){
      this.listPqrsFilter = [...this.listPqrsFilter].sort((a, b) => {
        const res = this.compareAsc(`${a.neighbor.nombres.toLowerCase()}`, `${b.neighbor.nombres.toLowerCase()}`);
        return res;
        });
    }
  }

  filtrarNombre(){
    this.listPqrsFilter = this.listPqrs.filter(element => {
      return element.neighbor.nombres.includes((this.filtro.get('filtroNombre').value)) ||
      element.neighbor.apellidos.includes((this.filtro.get('filtroNombre').value)) ||
      element.email.includes(this.filtro.get('filtroNombre').value) ||
      element.num_inmueble.includes(this.filtro.get('filtroNombre').value);
    });
  }

  filtrarEstado(){
    this.listPqrsFilter = this.listPqrs.filter(element => {
      return element.neighbor.estado.includes(this.filtro.get('filtroEstado').value.toUpperCase());
    });
  }


  getListPqrs(){
    this.cargando = true;
    // this.objEstablecimiento._id
    this.service.getPqrs('5ecd8bdf57780000cd006792').subscribe(response => {
        this.listPqrs = response.genericObject;
        const categoryKeys = Object.keys(this.listPqrs);
        categoryKeys.forEach(category => {
          this.listPqrs[category].forEach( cate => {
            cate.category = category;
            this.listado.push(cate);
          })
      });

      this.listPqrs = this.listado;
      this.listPqrsFilter = this.listPqrs;





       this.cargando = false;
    },error => {
      this.cargando = false;
    })
  }
}
