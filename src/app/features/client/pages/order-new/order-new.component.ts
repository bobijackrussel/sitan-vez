import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrdersService } from '../../../../core/api/orders.service';
import { OffersService } from '../../../../core/api/offers.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';

@Component({
  selector: 'app-order-new',
  standalone: false,
  templateUrl: './order-new.component.html',
  styleUrl: './order-new.component.css'
})
export class OrderNewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  tailors: string[] = [];
  loadingTailors = false;
  creating = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly ordersService: OrdersService,
    private readonly offersService: OffersService,
    private readonly toast: ToastService,
    private readonly context: ClientContextService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      krojacUsername: ['', Validators.required],
      napomena: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Creating orders is available only to client accounts.');
      this.router.navigate(['/public']);
      return;
    }
    this.loadTailors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { krojacUsername, napomena } = this.form.value;
    this.creating = true;
    this.ordersService.create({ krojacUsername, napomena })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.creating = false; })
      )
      .subscribe({
        next: order => {
          this.toast.success('Order created. Add your first item.');
          this.router.navigate(['/client/order', order.id, 'items', 'new']);
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to create order.';
          this.toast.error(message);
        }
      });
  }

  private loadTailors(): void {
    this.loadingTailors = true;
    this.offersService.list({ size: 100 })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingTailors = false; })
      )
      .subscribe({
        next: page => {
          const content = page.content ?? [];
          const usernames = new Set<string>();
          content.forEach(offer => {
            if (offer.krojacUsername) {
              usernames.add(offer.krojacUsername);
            }
          });
          this.tailors = Array.from(usernames).sort((a, b) => a.localeCompare(b));
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load tailor suggestions.';
          this.toast.error(message);
        }
      });
  }
}
