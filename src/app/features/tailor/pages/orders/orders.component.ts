import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService, NarudzbaPage } from '../../../../core/api/orders.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OrderSummary, NarudzbaFilterDTO } from '../../../../core/api/api.models';

interface PageState {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy {
  filtersForm: FormGroup;
  orders: OrderSummary[] = [];
  statuses: string[] = [];

  loading = false;
  page: PageState = { number: 0, size: 10, totalElements: 0, totalPages: 0 };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly ordersService: OrdersService,
    private readonly dictionaries: DictionariesService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.filtersForm = this.fb.group({
      status: [''],
      from: [''],
      to: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadStatuses();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.page.number = 0;
    this.loadOrders();
  }

  resetFilters(): void {
    this.filtersForm.reset({ status: '', from: '', to: '' });
    this.applyFilters();
  }

  trackOrder = (_: number, order: OrderSummary) => order.id;

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

  private loadOrders(): void {
    this.loading = true;
    const filter = this.buildFilterPayload();
    this.ordersService.filter(filter, { page: this.page.number, size: this.page.size })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: page => this.applyPage(page),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load orders.')
      });
  }

  private applyPage(page: NarudzbaPage): void {
    this.orders = page.content ?? [];
    this.page = {
      number: page.number,
      size: page.size,
      totalElements: page.totalElements,
      totalPages: page.totalPages
    };
  }

  private loadStatuses(): void {
    this.dictionaries.orderStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.statuses = list.map(status => status.naziv || '').filter(Boolean).sort((a, b) => a.localeCompare(b)),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load statuses.')
      });
  }

  private buildFilterPayload(): Partial<NarudzbaFilterDTO> {
    const raw = this.filtersForm.value;
    const filter: Partial<NarudzbaFilterDTO> = {
      krojacUsername: this.context.username
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
