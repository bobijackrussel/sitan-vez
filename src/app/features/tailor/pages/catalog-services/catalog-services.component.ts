import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UslugeService } from '../../../../core/api/usluge.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { DictionaryEntity } from '../../../../core/api/api.models';

@Component({
  selector: 'app-catalog-services',
  standalone: false,
  templateUrl: './catalog-services.component.html',
  styleUrl: './catalog-services.component.css'
})
export class CatalogServicesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  services: DictionaryEntity[] = [];
  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly usluge: UslugeService,
    private readonly toast: ToastService,
    private readonly context: TailorContextService
  ) {
    this.form = this.fb.group({
      naziv: ['', Validators.required],
      opis: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: DictionaryEntity = {
      naziv: this.form.value.naziv,
      opis: this.form.value.opis
    };

    this.saving = true;
    this.usluge.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Service saved.');
          this.form.reset();
          this.loadServices();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save service.';
          this.toast.error(message);
        }
      });
  }

  remove(service: DictionaryEntity): void {
    if (!service.naziv) { return; }
    this.usluge.delete(service.naziv || "")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success(`Removed ${service.naziv}.`);
          this.loadServices();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove service.';
          this.toast.error(message);
        }
      });
  }

  private loadServices(): void {
    this.loading = true;
    this.usluge.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => {
          this.services = list.sort((a, b) => (a.naziv || '').localeCompare(b.naziv || ''));
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load services.';
          this.toast.error(message);
        }
      });
  }
}
