import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MeasurementsService } from '../../../../core/api/measurements.service';
import { MeasurementSnapshot, MjereRequestDTO } from '../../../../core/api/api.models';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClientContextService } from '../../services/client-context.service';

@Component({
  selector: 'app-measurements',
  standalone: false,
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  measurements: MeasurementSnapshot[] = [];
  latest?: MeasurementSnapshot | null;
  editingId?: number;

  loadingList = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly measurementsService: MeasurementsService,
    private readonly context: ClientContextService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      obimGrudi: ['', [Validators.required, Validators.min(0)]],
      obimStruka: ['', [Validators.required, Validators.min(0)]],
      obimBokova: ['', [Validators.required, Validators.min(0)]],
      obimKukova: ['', [Validators.required, Validators.min(0)]],
      sirinaRamena: ['', [Validators.required, Validators.min(0)]],
      duzina: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (!this.context.isClient) {
      this.toast.warning('Measurements are available only to client accounts.');
      return;
    }
    this.loadMeasurements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackMeasurement = (_: number, measurement: MeasurementSnapshot) => measurement.id;

  startCreate(): void {
    this.editingId = undefined;
    this.form.reset();
  }

  startEdit(measurement: MeasurementSnapshot): void {
    this.editingId = measurement.id;
    this.form.patchValue({
      obimGrudi: measurement.obimGrudi,
      obimStruka: measurement.obimStruka,
      obimBokova: measurement.obimBokova,
      obimKukova: measurement.obimKukova,
      sirinaRamena: measurement.sirinaRamena,
      duzina: measurement.duzina
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: MjereRequestDTO = {
      ...(this.form.value as Omit<MjereRequestDTO, 'korisnickoIme' | 'id'>),
      korisnickoIme: this.context.username
    } as MjereRequestDTO;

    this.saving = true;
    const request$ = this.editingId
      ? this.measurementsService.update(this.editingId, payload)
      : this.measurementsService.create(payload);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.toast.success(`Measurements ${this.editingId ? 'updated' : 'saved'} successfully.`);
          this.form.reset();
          this.editingId = undefined;
          this.loadMeasurements();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save measurements.';
          this.toast.error(message);
        }
      });
  }

  hasError(control: string, error: string): boolean {
    const field = this.form.get(control);
    return !!field && field.touched && field.hasError(error);
  }

  private loadMeasurements(): void {
    this.loadingList = true;
    const usernameRequest = this.context.usernameRequest();

    this.measurementsService.list(usernameRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingList = false;
        })
      )
      .subscribe({
        next: list => {
          this.measurements = [...list].sort((a, b) => {
            const dateA = a.datum ? new Date(a.datum).getTime() : 0;
            const dateB = b.datum ? new Date(b.datum).getTime() : 0;
            return dateB - dateA;
          });
          this.latest = this.measurements[0] ?? null;
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Failed to load measurements.';
          this.toast.error(message);
        }
      });
  }
}
