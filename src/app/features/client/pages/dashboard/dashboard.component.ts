import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService, NarudzbaPage } from '../../../../core/api/orders.service';
import { MeasurementsService } from '../../../../core/api/measurements.service';
import { OffersService } from '../../../../core/api/offers.service';
import { OrderSummary, OfferSummary, MeasurementSnapshot, PageResponse } from '../../../../core/api/api.models';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = false;
  ordersLoading = false;
  measurementsLoading = false;
  offersLoading = false;

  latestMeasurement?: MeasurementSnapshot | null;
  recentOrders: OrderSummary[] = [];
  suggestedOffers: OfferSummary[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly ordersService: OrdersService,
    private readonly measurementsService: MeasurementsService,
    private readonly offersService: OffersService,
    private readonly toast: ToastService,
    private readonly context: ClientContextService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Client area is available only to client accounts.');
      this.router.navigate(['/public']);
      return;
    }

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackOrder = (_: number, order: OrderSummary) => order.id;
  trackOffer = (_: number, offer: OfferSummary) => offer.id;

  startNewOrder(): void {
    this.router.navigate(['/client/order/new']);
  }

  viewMeasurements(): void {
    this.router.navigate(['/client/measurements']);
  }

  openOrder(order: OrderSummary): void {
    this.router.navigate(['/client/orders', order.id]);
  }

  browseOffers(): void {
    this.router.navigate(['/public/offers']);
  }

  private loadDashboard(): void {
    this.loading = true;
    this.ordersLoading = true;
    this.measurementsLoading = true;
    this.offersLoading = true;

    const username = this.context.username;
    const usernameRequest = this.context.usernameRequest();

    const orders$ = this.ordersService.filter(
      { klijentUsername: username },
      { page: 0, size: 5 }
    );

    const measurements$ = this.measurementsService.latest(usernameRequest);
    const offers$ = this.offersService.list({ size: 4 });

    forkJoin({
      orders: orders$,
      measurement: measurements$,
      offers: offers$
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.ordersLoading = false;
          this.measurementsLoading = false;
          this.offersLoading = false;
        })
      )
      .subscribe({
        next: ({ orders, measurement, offers }) => {
          const ordersPage = orders as NarudzbaPage;
          this.recentOrders = ordersPage?.content ?? [];
          this.latestMeasurement = measurement ?? null;
          const offersPage = offers as PageResponse<OfferSummary>;
          this.suggestedOffers = offersPage?.content ?? [];
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Failed to load dashboard data.';
          this.toast.error(message);
        }
      });
  }
}
