import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService, NarudzbaPage } from '../../../../core/api/orders.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';
import { NarudzbaFilterDTO, OrderSummary } from '../../../../core/api/api.models';

interface PageState {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-orders-list',
  standalone: false,
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit, OnDestroy {
  filtersForm: FormGroup;
  orders: OrderSummary[] = [];
  hasActiveFilters = false;
  statuses: string[] = [];
  loading = false;
  page: PageState = { number: 0, size: 10, totalElements: 0, totalPages: 0 };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly ordersService: OrdersService,
    private readonly dictionaries: DictionariesService,
    private readonly toast: ToastService,
    private readonly context: ClientContextService,
    private readonly router: Router
  ) {
    this.filtersForm = this.fb.group({
      status: [''],
      from: [''],
      to: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Orders are available only to client accounts.');
      this.router.navigate(['/public']);
      return;
    }

    this.loadStatuses();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackOrder = (_: number, order: OrderSummary) => order.id;

  applyFilters(): void {
    this.page.number = 0;
    this.loadOrders();
  }

  resetFilters(): void {
    this.filtersForm.reset({ status: '', from: '', to: '' });
    this.applyFilters();
  }

  nextPage(): void {
    if (this.page.number + 1 < this.page.totalPages) {
      this.page.number += 1;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.page.number > 0) {
      this.page.number -= 1;
      this.loadOrders();
    }
  }

  openOrder(order: OrderSummary): void {
    this.router.navigate(['/client/orders', order.id]);
  }

  private loadStatuses(): void {
    this.dictionaries.orderStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: statuses => {
          this.statuses = statuses
            .map(status => status.naziv || '')
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load order statuses.';
          this.toast.error(message);
        }
      });
  }

  private loadOrders(resetError = true): void {
    if (resetError) {
      this.loading = true;
    }

    const filter = this.buildFilterPayload();

    this.ordersService.filter(filter, { page: this.page.number, size: this.page.size })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: page => {
          this.orders = page.content ?? [];
          this.page = {
            number: page.number,
            size: page.size,
            totalElements: page.totalElements,
            totalPages: page.totalPages
          };
          if (this.orders.length === 0 && page.totalElements === 0) {
            this.toast.info('No orders match the selected filters.');
          }
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Failed to load orders.';
          this.toast.error(message);
        }
      });
  }

  private buildFilterPayload(): Partial<NarudzbaFilterDTO> {
    const raw = this.filtersForm.value;
    const filter: Partial<NarudzbaFilterDTO> = {
      klijentUsername: this.context.username
    };

    if (raw.status) {
      filter.statusNarudzbe = [raw.status];
    }
    if (raw.from) {
      filter.datumZavrsetkaOd = raw.from;
    }
    if (raw.to) {
      filter.datumZavrsetkaDo = raw.to;
    }

    return filter;
  }
}
