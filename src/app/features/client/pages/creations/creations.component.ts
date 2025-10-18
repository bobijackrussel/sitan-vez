import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { KreacijeService } from '../../../../core/api/kreacije.service';
import { Creation } from '../../../../core/api/api.models';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';

@Component({
  selector: 'app-creations',
  standalone: false,
  templateUrl: './creations.component.html',
  styleUrl: './creations.component.css'
})
export class CreationsComponent implements OnInit, OnDestroy {
  creations: Creation[] = [];
  loading = false;
  missingId = false;
  readonly placeholderImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="180"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18">Creation</text></svg>';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly kreacije: KreacijeService,
    private readonly context: ClientContextService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Creations gallery is available only to client accounts.');
      return;
    }

    this.loading = true;
    this.context.ensureClientId()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(id => {
          if (id === null) {
            this.missingId = true;
            this.toast.info('No creations yet. Place an order to see finished garments here.');
            return EMPTY;
          }
          return this.kreacije.listByClient(id as number);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: creations => {
          this.creations = creations ?? [];
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load creations.';
          this.toast.error(message);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackCreation = (_: number, creation: Creation) => creation.id;
}
