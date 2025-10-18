import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { RegisterTailorComponent } from './register-tailor.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';

describe('RegisterTailorComponent', () => {
  let component: RegisterTailorComponent;
  let fixture: ComponentFixture<RegisterTailorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterTailorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerTailor: () => of({})
          }
        },
        {
          provide: DictionariesService,
          useValue: {
            countries: () => of([])
          }
        },
        ApiErrorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterTailorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
