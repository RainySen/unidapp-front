import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Establecimiento } from 'src/utils/models/establecimiento/establecimiento';


@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.scss']
})
export class PqrsComponent implements OnInit {

  @Input() opcion;
  @Output() nombreMenu = new EventEmitter<string>();
  @Input() objEstablecimiento: Establecimiento;

  editar: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  isBackPqrs() {
    this.editar = false;
  }

  crearpqrs(){
    this.editar = true;
  }
}
