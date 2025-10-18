import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { OfferDetailComponent } from './offer-detail.component';
import { OffersService } from '../../../../core/api/offers.service';
import { KrojacDrzavaPonudaService } from '../../../../core/api/krojac-drzava-ponuda.service';
import { AddonsService } from '../../../../core/api/addons.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';

describe('OfferDetailComponent', () => {
  let component: OfferDetailComponent;
  let fixture: ComponentFixture<OfferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } }
        },
        {
          provide: OffersService,
          useValue: {
            byId: () => of({
              id: 1,
              jedinicnaCijena: 100,
              krojacUsername: 'tailor',
              procenatPopusta: 0,
              procenatZaHitnost: 0,
              uslugaNaziv: 'Service'
            }),
            filterVariations: () => of(null)
          }
        },
        {
          provide: KrojacDrzavaPonudaService,
          useValue: { list: () => of([]) }
        },
        {
          provide: AddonsService,
          useValue: { listByArticle: () => of([]) }
        },
        {
          provide: AuthService,
          useValue: { isLoggedIn: () => false, role: null }
        },
        ApiErrorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
