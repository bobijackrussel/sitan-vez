import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MeasurementsService } from './measurements.service';

describe('MeasurementsService', () => {
  let service: MeasurementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(MeasurementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
