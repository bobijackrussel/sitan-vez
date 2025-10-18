import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { KreacijeService } from './kreacije.service';

describe('KreacijeService', () => {
  let service: KreacijeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(KreacijeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
