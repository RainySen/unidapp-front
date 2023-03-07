import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVecinoComponent } from './create-vecino.component';

describe('CreateVecinoComponent', () => {
  let component: CreateVecinoComponent;
  let fixture: ComponentFixture<CreateVecinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVecinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVecinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
