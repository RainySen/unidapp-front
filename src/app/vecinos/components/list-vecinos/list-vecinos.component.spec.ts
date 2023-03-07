import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVecinosComponent } from './list-vecinos.component';

describe('ListVecinosComponent', () => {
  let component: ListVecinosComponent;
  let fixture: ComponentFixture<ListVecinosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVecinosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVecinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
