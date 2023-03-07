import { TestBed } from '@angular/core/testing';

import { ServiceEstablecimientoService } from './service-establecimiento.service';

describe('ServiceEstablecimientoService', () => {
  let service: ServiceEstablecimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEstablecimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
