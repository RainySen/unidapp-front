import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPqrsComponent } from './list-pqrs.component';

describe('ListPqrsComponent', () => {
  let component: ListPqrsComponent;
  let fixture: ComponentFixture<ListPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
