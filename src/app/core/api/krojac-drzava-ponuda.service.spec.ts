import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { KrojacDrzavaPonudaService } from './krojac-drzava-ponuda.service';

describe('KrojacDrzavaPonudaService', () => {
  let service: KrojacDrzavaPonudaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(KrojacDrzavaPonudaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
