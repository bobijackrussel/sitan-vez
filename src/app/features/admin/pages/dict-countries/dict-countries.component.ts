import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DictionaryEntity } from '../../../../core/api/api.models';

@Component({
  selector: 'app-dict-countries',
  standalone: false,
  templateUrl: './dict-countries.component.html',
  styleUrl: './dict-countries.component.css'
})
export class DictCountriesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  countries: DictionaryEntity[] = [];
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
    this.dictionaries.createCountry({ naziv: this.form.value.naziv })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Country added.');
          this.form.reset();
          this.load();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to add country.')
      });
  }

  remove(country: DictionaryEntity): void {
    if (country.id == null) { return; }
    this.dictionaries.deleteCountry(country.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Country removed.');
          this.load();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to remove country.')
      });
  }

  private load(): void {
    this.loading = true;
    this.dictionaries.countries()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.countries = list.sort((a, b) => (a.naziv || '').localeCompare(b.naziv || '')),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load countries.')
      });
  }
}
