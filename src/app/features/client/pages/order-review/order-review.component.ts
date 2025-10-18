import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService } from '../../../../core/api/orders.service';
import { OrderItemsService } from '../../../../core/api/order-items.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OrderSummary, OrderItemSummary } from '../../../../core/api/api.models';

@Component({
  selector: 'app-order-review',
  standalone: false,
  templateUrl: './order-review.component.html',
  styleUrl: './order-review.component.css'
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  order?: OrderSummary;
  items: OrderItemSummary[] = [];
  orderStatuses: string[] = [];
  selectedStatus = '';
  private initialStatus = '';

  loading = false;
  submitting = false;

  private readonly destroy$ = new Subject<void>();
  private orderId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
    private readonly dictionaries: DictionariesService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    if (!this.orderId) {
      this.toast.error('Order not found.');
      this.router.navigate(['/client/orders']);
      return;
    }

    this.loadStatuses();
    this.loadSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackItem = (_: number, item: OrderItemSummary) => item.id;

  addMore(): void {
    this.router.navigate(['/client/order', this.orderId, 'items', 'new']);
  }

  viewOrder(): void {
    this.router.navigate(['/client/orders', this.orderId]);
  }

  submitOrder(): void {
    if (!this.selectedStatus) {
      this.toast.info('Select a status to submit the order.');
      return;
    }
    this.submitting = true;
    this.ordersService.updateStatus(this.orderId, this.selectedStatus)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.submitting = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Order submitted successfully.');
          this.router.navigate(['/client/orders', this.orderId]);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to submit order.';
          this.toast.error(message);
        }
      });
  }

  private loadStatuses(): void {
    this.dictionaries.orderStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => {
          this.orderStatuses = list.map(status => status.naziv || '').filter(Boolean).sort((a, b) => a.localeCompare(b));
          if (!this.selectedStatus && this.orderStatuses.length > 0) {
            this.selectedStatus = this.orderStatuses[0];
          }
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load order statuses.';
          this.toast.error(message);
        }
      });
  }

  private loadSummary(): void {
    this.loading = true;
    forkJoin({
      order: this.ordersService.get(this.orderId),
      items: this.orderItemsService.list({ narudzbaId: this.orderId })
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: ({ order, items }) => {
          this.order = order;
          this.items = items;
          if (order?.statusNarudzbeNaziv) {
            this.selectedStatus = order.statusNarudzbeNaziv;
          }
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load order summary.';
          this.toast.error(message);
        }
      });
  }
}



