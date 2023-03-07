import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-pqrs',
  templateUrl: './create-pqrs.component.html',
  styleUrls: ['./create-pqrs.component.scss']
})
export class CreatePqrsComponent implements OnInit {

  editar=true;
  public Editor = ClassicEditor;
  constructor() { }
  contenidoPlaceholder = 'Escribe aquí el mensaje que quieres darle al vecino...';
  ngOnInit(): void {
  }

  backPqrs(){
    this.editar=false;
  }

}
