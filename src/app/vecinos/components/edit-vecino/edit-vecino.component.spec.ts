import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVecinoComponent } from './edit-vecino.component';

describe('EditVecinoComponent', () => {
  let component: EditVecinoComponent;
  let fixture: ComponentFixture<EditVecinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVecinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVecinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
