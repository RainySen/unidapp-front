import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoViewComponent } from './activo-view.component';

describe('ActivoViewComponent', () => {
  let component: ActivoViewComponent;
  let fixture: ComponentFixture<ActivoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
