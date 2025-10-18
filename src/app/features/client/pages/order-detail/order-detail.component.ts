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
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order?: OrderSummary;
  items: OrderItemSummary[] = [];
  orderStatuses: string[] = [];
  itemStatuses: string[] = [];

  loading = false;
  updatingOrder = false;
  itemLoading: Record<number, boolean> = {};

  private orderId!: number;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
    private readonly dictionaries: DictionariesService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.orderId = Number(param);
    if (!this.orderId) {
      this.toast.error('Order not found.');
      this.router.navigate(['/client/orders']);
      return;
    }

    this.loadDictionaries();
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackItem = (_: number, item: OrderItemSummary) => item.id;

  refresh(): void {
    this.loadOrder();
  }

  updateOrderStatus(status: string): void {
    if (!status || !this.order) { return; }
    this.updatingOrder = true;
    this.ordersService.updateStatus(this.orderId, status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.updatingOrder = false; })
      )
      .subscribe({
        next: updated => {
          this.order = { ...this.order!, statusNarudzbeNaziv: updated.statusNarudzbeNaziv };
          this.toast.success('Order status updated.');
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to update order status.';
          this.toast.error(message);
        }
      });
  }

  toggleOrderDeposit(): void {
    if (!this.order) { return; }
    const nextValue = this.order.uplacenAvans ? 0 : 1;
    this.updatingOrder = true;
    this.ordersService.updateDeposit(this.orderId, nextValue)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.updatingOrder = false; })
      )
      .subscribe({
        next: updated => {
          this.order = { ...this.order!, uplacenAvans: updated.uplacenAvans };
          this.toast.success(`Deposit ${updated.uplacenAvans ? 'marked as paid' : 'set to pending'}.`);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to update deposit status.';
          this.toast.error(message);
        }
      });
  }

  updateItemStatus(item: OrderItemSummary, status: string): void {
    if (!status) { return; }
    this.setItemLoading(item.id, true);
    this.orderItemsService.setStatus(item.id, status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setItemLoading(item.id, false))
      )
      .subscribe({
        next: updated => {
          this.items = this.items.map(current => current.id === item.id ? { ...current, statusStavkeNaziv: updated.statusStavkeNaziv } : current);
          this.toast.success('Item status updated.');
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to update item status.';
          this.toast.error(message);
        }
      });
  }

  toggleItemDeposit(item: OrderItemSummary): void {
    const next = !(item.uplacenAvans ?? 0);
    this.setItemLoading(item.id, true);
    this.orderItemsService.setDeposit(item.id, next)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setItemLoading(item.id, false))
      )
      .subscribe({
        next: updated => {
          this.items = this.items.map(current => current.id === item.id ? { ...current, uplacenAvans: updated.uplacenAvans } : current);
          this.toast.success(`Item deposit ${updated.uplacenAvans ? 'marked as paid' : 'set to pending'}.`);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to update item deposit.';
          this.toast.error(message);
        }
      });
  }

  private loadDictionaries(): void {
    this.dictionaries.orderStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => {
          this.orderStatuses = list.map(item => item.naziv || '').filter(Boolean).sort((a, b) => a.localeCompare(b));
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load order statuses.';
          this.toast.error(message);
        }
      });

    this.dictionaries.itemStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => {
          this.itemStatuses = list.map(item => item.naziv || '').filter(Boolean).sort((a, b) => a.localeCompare(b));
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load line item statuses.';
          this.toast.error(message);
        }
      });
  }

  private loadOrder(): void {
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
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load order.';
          this.toast.error(message);
        }
      });
  }

  private setItemLoading(itemId: number, loading: boolean): void {
    this.itemLoading = { ...this.itemLoading, [itemId]: loading };
  }
}
