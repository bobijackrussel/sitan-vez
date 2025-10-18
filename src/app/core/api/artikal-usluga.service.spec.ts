import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ArtikalUslugaService } from './artikal-usluga.service';

describe('ArtikalUslugaService', () => {
  let service: ArtikalUslugaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ArtikalUslugaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
