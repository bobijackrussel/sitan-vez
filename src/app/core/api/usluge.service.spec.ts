import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UslugeService } from './usluge.service';

describe('UslugeService', () => {
  let service: UslugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UslugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
