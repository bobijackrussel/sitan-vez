import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DictionaryEntity, KategorijaPodkategorijaRequest, KategorijaPodkategorijaResponse } from '../../../../core/api/api.models';

@Component({
  selector: 'app-dict-category-mapping',
  standalone: false,
  templateUrl: './dict-category-mapping.component.html',
  styleUrl: './dict-category-mapping.component.css'
})
export class DictCategoryMappingComponent implements OnInit, OnDestroy {
  form: FormGroup;
  categories: string[] = [];
  subcategories: string[] = [];
  mappings: KategorijaPodkategorijaResponse[] = [];

  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly dictionaries: DictionariesService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      kategorijaNaziv: ['', Validators.required],
      podkategorijaNaziv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadMappings();
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

    const payload: KategorijaPodkategorijaRequest = {
      kategorijaNaziv: this.form.value.kategorijaNaziv,
      podkategorijaNaziv: this.form.value.podkategorijaNaziv
    };

    this.saving = true;
    this.dictionaries.createCategoryMapping(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Mapping added.');
          this.form.reset();
          this.loadMappings();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to add mapping.')
      });
  }

  remove(mapping: KategorijaPodkategorijaResponse): void {
    if (mapping.id == null) {
      this.toast.error('Mapping identifier missing; refresh the page.');
      return;
    }
    this.dictionaries.deleteCategoryMapping(mapping.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Mapping removed.');
          this.loadMappings();
        },
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to remove mapping.')
      });
  }

  private loadLookups(): void {
    this.dictionaries.categories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.categories = this.mapNames(list),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load categories.')
      });

    this.dictionaries.subcategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.subcategories = this.mapNames(list),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load subcategories.')
      });
  }

  private loadMappings(): void {
    this.loading = true;
    this.dictionaries.categoryMappings()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.mappings = list.slice().sort((a, b) => {
          const categoryCompare = (a.kategorijaNaziv || "").localeCompare(b.kategorijaNaziv || "");
          if (categoryCompare !== 0) { return categoryCompare; }
          return (a.podkategorijaNaziv || "").localeCompare(b.podkategorijaNaziv || "");
        }),
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load mappings.')
      });
  }

  private mapNames(entries: DictionaryEntity[]): string[] {
    const unique = Array.from(
      new Set(
        entries
          .map(entry => entry.naziv || '')
          .filter((naziv): naziv is string => !!naziv)
      )
    );

    return unique.sort((a, b) => a.localeCompare(b));
  }
}

