import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { KrojacDrzavaService } from './krojac-drzava.service';

describe('KrojacDrzavaService', () => {
  let service: KrojacDrzavaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(KrojacDrzavaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
