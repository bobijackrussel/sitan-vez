import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OffersListComponent } from './offers-list.component';
import { OffersService } from '../../../../core/api/offers.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { UslugeService } from '../../../../core/api/usluge.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';

describe('OffersListComponent', () => {
  let component: OffersListComponent;
  let fixture: ComponentFixture<OffersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffersListComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: OffersService,
          useValue: {
            list: () => of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 9 }),
            filter: () => of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 9 }),
            filterVariations: () => of({})
          }
        },
        {
          provide: DictionariesService,
          useValue: {
            countries: () => of([]),
            categories: () => of([]),
            subcategories: () => of([]),
            categoryMappings: () => of([])
          }
        },
        {
          provide: UslugeService,
          useValue: {
            list: () => of([])
          }
        },
        ApiErrorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
