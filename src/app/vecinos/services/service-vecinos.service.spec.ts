import { TestBed } from '@angular/core/testing';

import { ServiceVecinos } from './service-vecinos.service';

describe('ServiceEstablecimientoService', () => {
  let service: ServiceVecinos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceVecinos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
