import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService, NarudzbaPage } from '../../../../core/api/orders.service';
import { OrderItemsService } from '../../../../core/api/order-items.service';
import { OffersService } from '../../../../core/api/offers.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { OrderSummary, OrderItemSummary, OfferSummary, PageResponse } from '../../../../core/api/api.models';

interface MetricCard {
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
  metrics: MetricCard[] = [];
  recentOrders: OrderSummary[] = [];
  recentItems: OrderItemSummary[] = [];
  offers: OfferSummary[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
    private readonly offersService: OffersService,
    private readonly toast: ToastService,
    private readonly context: TailorContextService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
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
  trackItem = (_: number, item: OrderItemSummary) => item.id;
  trackOffer = (_: number, offer: OfferSummary) => offer.id;

  goto(path: string): void {
    this.router.navigate([path]);
  }

  private loadDashboard(): void {
    this.loading = true;
    const username = this.context.username;

    forkJoin({
      orders: this.ordersService.filter({ krojacUsername: username }, { page: 0, size: 10 }),
      items: this.orderItemsService.filter({ ponudaFilter: { krojacUsername: username } }),
      offers: this.offersService.filter({ krojacUsername: username }, { page: 0, size: 10 })
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: ({ orders, items, offers }) => {
          this.recentOrders = orders.content ?? [];
          this.recentItems = (items ?? []).slice(0, 8);
          this.offers = offers.content ?? [];

          this.metrics = this.buildMetrics(orders, items ?? [], offers);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load dashboard data.';
          this.toast.error(message);
        }
      });
  }

  private buildMetrics(orders: NarudzbaPage, items: OrderItemSummary[], offers: PageResponse<OfferSummary>): MetricCard[] {
    const totalOrders = orders.totalElements ?? (orders.content?.length ?? 0);
    const pendingDeposits = (orders.content ?? []).filter(order => !order.uplacenAvans).length;
    const activeItems = items.filter(item => !item.uplacenAvans || !this.isClosedStatus(item.statusStavkeNaziv)).length;
    const publishedOffers = offers.totalElements ?? (offers.content?.length ?? 0);

    return [
      { label: 'Total orders', value: totalOrders, hint: 'All orders assigned to you' },
      { label: 'Deposit pending', value: pendingDeposits, hint: 'Orders awaiting deposit confirmation' },
      { label: 'Active line items', value: activeItems, hint: 'Items still in progress' },
      { label: 'Published offers', value: publishedOffers, hint: 'Offers visible to clients' }
    ];
  }

  private isClosedStatus(status?: string | null): boolean {
    if (!status) { return false; }
    const normalized = status.toLowerCase();
    return normalized.includes('zavr') || normalized.includes('complete') || normalized.includes('closed');
  }
}
