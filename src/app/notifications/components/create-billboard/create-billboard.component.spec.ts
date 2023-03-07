import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillboardComponent } from './create-billboard.component';

describe('CreateBillboardComponent', () => {
  let component: CreateBillboardComponent;
  let fixture: ComponentFixture<CreateBillboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBillboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
