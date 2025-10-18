import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TailorContextService } from '../../services/tailor-context.service';
import { KrojacDrzavaService } from '../../../../core/api/krojac-drzava.service';
import { KrojacDrzavaPonudaService } from '../../../../core/api/krojac-drzava-ponuda.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { OffersService } from '../../../../core/api/offers.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../core/auth/auth.service';
import {
  KrojacDrzavaRequestDTO,
  KrojacDrzavaPonudaResponseDTO,
  KrojacDrzavaPonudaRequestDTO,
  OfferSummary,
  DictionaryEntity
} from '../../../../core/api/api.models';

interface TailorCountry extends KrojacDrzavaRequestDTO {
  id?: number;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  countryForm: FormGroup;
  mappingForm: FormGroup;

  availableCountries: string[] = [];
  tailorCountries: TailorCountry[] = [];
  countryMappings: KrojacDrzavaPonudaResponseDTO[] = [];
  offers: OfferSummary[] = [];

  loadingCountries = false;
  loadingMappings = false;
  savingCountry = false;
  savingMapping = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly context: TailorContextService,
    private readonly drzavaService: KrojacDrzavaService,
    private readonly drzavaPonudaService: KrojacDrzavaPonudaService,
    private readonly dictionaries: DictionariesService,
    private readonly offersService: OffersService,
    private readonly toast: ToastService
  ) {
    this.countryForm = this.fb.group({
      drzavaNaziv: ['', Validators.required],
      cijenaPostarine: ['', [Validators.required, Validators.min(0)]]
    });

    this.mappingForm = this.fb.group({
      drzavaNaziv: ['', Validators.required],
      ponudaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }

    this.loadDictionaries();
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get username(): string {
    return this.context.username;
  }

  get email(): string | null {
    return this.auth.username ? null : null;
  }

  saveCountry(): void {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }

    const payload: KrojacDrzavaRequestDTO = {
      drzavaNaziv: this.countryForm.value.drzavaNaziv,
      cijenaPostarine: Number(this.countryForm.value.cijenaPostarine),
      krojacKorisnickoIme: this.username
    };

    this.savingCountry = true;
    this.drzavaService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.savingCountry = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Operating country saved.');
          this.countryForm.reset();
          this.refreshCountries();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save country.';
          this.toast.error(message);
        }
      });
  }

  removeCountry(country: TailorCountry): void {
    if (!country.id) { return; }
    this.drzavaService.delete(country.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success(`Removed ${country.drzavaNaziv}.`);
          this.refreshCountries();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove country.';
          this.toast.error(message);
        }
      });
  }

  saveMapping(): void {
    if (this.mappingForm.invalid) {
      this.mappingForm.markAllAsTouched();
      return;
    }

    const payload: KrojacDrzavaPonudaRequestDTO = {
      drzavaNaziv: this.mappingForm.value.drzavaNaziv,
      ponudaId: Number(this.mappingForm.value.ponudaId),
      krojacUsername: this.username
    };

    this.savingMapping = true;
    this.drzavaPonudaService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.savingMapping = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Country mapping saved.');
          this.mappingForm.reset();
          this.refreshMappings();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to map country to offer.';
          this.toast.error(message);
        }
      });
  }

  removeMapping(mapping: KrojacDrzavaPonudaResponseDTO): void {
    if (!mapping.id) { return; }
    this.drzavaPonudaService.delete(mapping.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Mapping removed.');
          this.refreshMappings();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove mapping.';
          this.toast.error(message);
        }
      });
  }

  private refreshData(): void {
    this.refreshCountries();
    this.refreshMappings();
    this.loadOffers();
  }

  private refreshCountries(): void {
    this.loadingCountries = true;
    this.drzavaService.list(this.username)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingCountries = false; })
      )
      .subscribe({
        next: countries => {
          this.tailorCountries = countries as TailorCountry[];
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load operating countries.';
          this.toast.error(message);
        }
      });
  }

  private refreshMappings(): void {
    this.loadingMappings = true;
    this.drzavaPonudaService.list({ krojacUsername: this.username })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingMappings = false; })
      )
      .subscribe({
        next: mappings => {
          this.countryMappings = mappings;
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load mappings.';
          this.toast.error(message);
        }
      });
  }

  private loadOffers(): void {
    this.offersService.filter({ krojacUsername: this.username }, { page: 0, size: 200 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: page => {
          this.offers = page.content ?? [];
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load offers.';
          this.toast.error(message);
        }
      });
  }

  private loadDictionaries(): void {
    this.dictionaries.countries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: entries => {
          this.availableCountries = entries
            .map((entry: DictionaryEntity) => entry.naziv || '')
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
        }
      });
  }
}
