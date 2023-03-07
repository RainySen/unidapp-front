import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablecimientoViewComponent } from './establecimiento-view.component';

describe('EstablecimientoViewComponent', () => {
  let component: EstablecimientoViewComponent;
  let fixture: ComponentFixture<EstablecimientoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablecimientoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablecimientoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
