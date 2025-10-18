import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ClientsService } from '../../../../core/api/clients.service';
import { OffersService } from '../../../../core/api/offers.service';
import { OrdersService, NarudzbaPage } from '../../../../core/api/orders.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientSummary, OfferSummary, OrderSummary, PageResponse } from '../../../../core/api/api.models';

interface DashboardMetric {
  label: string;
  value: number;
  hint?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = false;
  metrics: DashboardMetric[] = [];
  recentOffers: OfferSummary[] = [];
  recentOrders: OrderSummary[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly clients: ClientsService,
    private readonly offers: OffersService,
    private readonly orders: OrdersService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackOffer = (_: number, offer: OfferSummary) => offer.id;
  trackOrder = (_: number, order: OrderSummary) => order.id;

  private loadDashboard(): void {
    this.loading = true;

    forkJoin({
      clients: this.clients.list({ size: 50 }),
      offers: this.offers.list({ page: 0, size: 5 }),
      orders: this.orders.filter({}, { page: 0, size: 5 })
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: ({ clients, offers, orders }) => {
          this.recentOffers = offers.content ?? [];
          this.recentOrders = orders.content ?? [];
          this.metrics = this.buildMetrics(clients, offers, orders);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load admin dashboard.';
          this.toast.error(message);
        }
      });
  }

  private buildMetrics(clients: ClientSummary[], offers: PageResponse<OfferSummary>, orders: NarudzbaPage): DashboardMetric[] {
    return [
      { label: 'Clients', value: clients.length },
      { label: 'Offers', value: offers.totalElements ?? (offers.content?.length ?? 0) },
      { label: 'Orders', value: orders.totalElements ?? (orders.content?.length ?? 0) }
    ];
  }
}
