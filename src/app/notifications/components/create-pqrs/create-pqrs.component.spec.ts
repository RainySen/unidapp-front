import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePqrsComponent } from './create-pqrs.component';

describe('CreatePqrsComponent', () => {
  let component: CreatePqrsComponent;
  let fixture: ComponentFixture<CreatePqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
