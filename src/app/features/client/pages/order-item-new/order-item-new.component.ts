import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OffersService } from '../../../../core/api/offers.service';
import { MeasurementsService } from '../../../../core/api/measurements.service';
import { OrderItemsService, CreateOrderItemPayload } from '../../../../core/api/order-items.service';
import { AddonsService } from '../../../../core/api/addons.service';
import { OfferSummary, MeasurementSnapshot, ArtikalDodatakResponse } from '../../../../core/api/api.models';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';

@Component({
  selector: 'app-order-item-new',
  standalone: false,
  templateUrl: './order-item-new.component.html',
  styleUrl: './order-item-new.component.css'
})
export class OrderItemNewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  offers: OfferSummary[] = [];
  measurements: MeasurementSnapshot[] = [];
  addons: ArtikalDodatakResponse[] = [];
  selectedAddonIds = new Set<number>();

  loadingOffers = false;
  loadingMeasurements = false;
  loadingAddons = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();
  private orderId!: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly offersService: OffersService,
    private readonly measurementsService: MeasurementsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly addonsService: AddonsService,
    private readonly toast: ToastService,
    private readonly context: ClientContextService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      offerId: ['', Validators.required],
      measurementId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Order items can be added only by client accounts.');
      this.router.navigate(['/public']);
      return;
    }

    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    if (!this.orderId) {
      this.toast.error('Order not found.');
      this.router.navigate(['/client/orders']);
      return;
    }

    this.loadOffers();
    this.loadMeasurements();

    this.form.get('offerId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.handleOfferChange(Number(value)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  offerLabel(offer: OfferSummary): string {
    if ('artikal' in offer && offer.artikal) {
      return offer.artikal.naziv || offer.uslugaNaziv || `Offer ${offer.id}`;
    }
    return offer.uslugaNaziv || `Offer ${offer.id}`;
  }

  measurementLabel(snapshot: MeasurementSnapshot): string {
    return `${snapshot.datum || 'Snapshot'} - Chest ${snapshot.obimGrudi}cm`;
  }

  toggleAddon(addonId: number, checked: boolean): void {
    if (checked) {
      this.selectedAddonIds.add(addonId);
    } else {
      this.selectedAddonIds.delete(addonId);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { offerId, measurementId, quantity } = this.form.value;
    const payload: CreateOrderItemPayload = {
      narudzbaId: this.orderId,
      ponudaId: Number(offerId),
      mjereId: Number(measurementId),
      kolicina: Number(quantity) || 1
    };

    if (this.selectedAddonIds.size) {
      payload.dodaciIds = Array.from(this.selectedAddonIds);
    }


    this.saving = true;
    this.orderItemsService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Item added to order.');
          this.router.navigate(['/client/order', this.orderId, 'review']);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to add item.';
          this.toast.error(message);
        }
      });
  }

  private loadOffers(): void {
    this.loadingOffers = true;
    this.offersService.list({ size: 50 })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingOffers = false; })
      )
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

  private loadMeasurements(): void {
    this.loadingMeasurements = true;
    this.measurementsService.list(this.context.usernameRequest())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingMeasurements = false; })
      )
      .subscribe({
        next: list => {
          this.measurements = list;
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load measurements.';
          this.toast.error(message);
        }
      });
  }

  private handleOfferChange(offerId: number): void {
    this.selectedAddonIds.clear();
    const offer = this.offers.find(item => item.id === offerId);
    if (!offer || !('artikal' in offer) || !offer.artikal?.id) {
      this.addons = [];
      return;
    }

    this.loadingAddons = true;
    this.addonsService.listByArticle(offer.artikal.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingAddons = false; })
      )
      .subscribe({
        next: addons => {
          this.addons = addons;
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load add-ons for selected offer.';
          this.toast.error(message);
        }
      });
  }
}



