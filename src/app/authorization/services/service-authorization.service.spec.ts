import { TestBed } from '@angular/core/testing';

import { ServiceAuthorizationService } from './service-authorization.service';

describe('ServiceAuthorizationService', () => {
  let service: ServiceAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
