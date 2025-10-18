import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { LandingComponent } from './landing.component';
import { OffersService } from '../../../../core/api/offers.service';
import { KreacijeService } from '../../../../core/api/kreacije.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: OffersService,
          useValue: {
            list: () => of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 6 })
          }
        },
        {
          provide: KreacijeService,
          useValue: {
            list: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
