import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SabloniService } from './sabloni.service';

describe('SabloniService', () => {
  let service: SabloniService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SabloniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
