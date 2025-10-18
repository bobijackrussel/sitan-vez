import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OffersService } from '../../../../core/api/offers.service';
import { UslugeService } from '../../../../core/api/usluge.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OfferSummary, PageResponse, DictionaryEntity, PonudaUslugaRequestDTO } from '../../../../core/api/api.models';

interface OfferPageState {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

@Component({
  selector: 'app-offers',
  standalone: false,
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit, OnDestroy {
  serviceForm: FormGroup;
  offers: OfferSummary[] = [];
  services: DictionaryEntity[] = [];

  loading = false;
  creating = false;
  page: OfferPageState = { number: 0, size: 10, totalPages: 0, totalElements: 0 };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly offersService: OffersService,
    private readonly uslugeService: UslugeService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.serviceForm = this.fb.group({
      uslugaNaziv: ['', Validators.required],
      jedinicnaCijena: ['', Validators.required],
      procenatPopusta: [0, [Validators.min(0), Validators.max(100)]],
      procenatZaHitnost: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadServices();
    this.loadOffers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveServiceOffer(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const raw = this.serviceForm.value;
    const payload: PonudaUslugaRequestDTO = {
      uslugaNaziv: raw.uslugaNaziv,
      jedinicnaCijena: Number(raw.jedinicnaCijena),
      procenatPopusta: Number(raw.procenatPopusta) || 0,
      procenatZaHitnost: Number(raw.procenatZaHitnost) || 0,
      krojacUsername: this.context.username
    };

    this.creating = true;
    this.offersService.createServiceOffer(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.creating = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Service offer created.');
          this.serviceForm.reset({ procenatPopusta: 0, procenatZaHitnost: 0 });
          this.loadOffers();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to create service offer.';
          this.toast.error(message);
        }
      });
  }

  nextPage(): void {
    if (this.page.number + 1 < this.page.totalPages) {
      this.page.number += 1;
      this.loadOffers();
    }
  }

  previousPage(): void {
    if (this.page.number > 0) {
      this.page.number -= 1;
      this.loadOffers();
    }
  }

  private loadOffers(): void {
    this.loading = true;
    this.offersService.filter({ krojacUsername: this.context.username }, { page: this.page.number, size: this.page.size })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: page => this.applyPage(page),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load offers.')
      });
  }

  private applyPage(page: PageResponse<OfferSummary>): void {
    this.offers = page.content ?? [];
    this.page = {
      number: page.number,
      size: page.size,
      totalPages: page.totalPages,
      totalElements: page.totalElements
    };
  }

  private loadServices(): void {
    this.uslugeService.list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.services = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load services list.')
      });
  }
}
