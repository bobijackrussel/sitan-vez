import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DictionaryEntity } from '../../../../core/api/api.models';

@Component({
  selector: 'app-dict-qualities',
  standalone: false,
  templateUrl: './dict-qualities.component.html',
  styleUrl: './dict-qualities.component.css'
})
export class DictQualitiesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  qualities: DictionaryEntity[] = [];
  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly dictionaries: DictionariesService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({ naziv: ['', Validators.required] });
  }

  ngOnInit(): void {
    this.load();
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

    this.saving = true;
    this.dictionaries.createQuality({ naziv: this.form.value.naziv })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Quality added.');
          this.form.reset();
          this.load();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to add quality.')
      });
  }

  remove(quality: DictionaryEntity): void {
    if (quality.id == null) { return; }
    this.dictionaries.deleteQuality(quality.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Quality removed.');
          this.load();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to remove quality.')
      });
  }

  private load(): void {
    this.loading = true;
    this.dictionaries.qualities()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.qualities = list.sort((a, b) => (a.naziv || '').localeCompare(b.naziv || '')),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load qualities.')
      });
  }
}


