import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddonsService } from '../../../../core/api/addons.service';
import { ArticlesService } from '../../../../core/api/articles.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ArtikalDodatakResponse, ArtikalResponseDTO } from '../../../../core/api/api.models';

@Component({
  selector: 'app-catalog-addons',
  standalone: false,
  templateUrl: './catalog-addons.component.html',
  styleUrl: './catalog-addons.component.css'
})
export class CatalogAddonsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  addons: ArtikalDodatakResponse[] = [];
  articles: ArtikalResponseDTO[] = [];
  selectedArticleId?: number;

  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly addonsService: AddonsService,
    private readonly articlesService: ArticlesService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      artikalId: ['', Validators.required],
      naziv: ['', Validators.required],
      opis: [''],
      cijena: ['', Validators.required],
      slikaBase64: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadArticles();
    this.loadAddons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByArticle(articleId: string): void {
    this.selectedArticleId = articleId ? Number(articleId) : undefined;
    this.loadAddons();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const payload: Record<string, unknown> = {
      artikalId: Number(raw.artikalId),
      naziv: raw.naziv,
      opis: raw.opis,
      cijena: Number(raw.cijena),
      slikaBase64: raw.slikaBase64 || ''
    };

    this.saving = true;
    this.addonsService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Add-on saved.');
          this.form.reset();
          this.loadAddons();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save add-on.';
          this.toast.error(message);
        }
      });
  }

  remove(addon: ArtikalDodatakResponse): void {
    this.addonsService.delete(addon.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Add-on removed.');
          this.loadAddons();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to delete add-on.';
          this.toast.error(message);
        }
      });
  }

  private loadArticles(): void {
    this.articlesService.list({ krojacUsername: this.context.username })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.articles = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load articles.')
      });
  }

  private loadAddons(): void {
    this.loading = true;
    const fetch$ = this.selectedArticleId
      ? this.addonsService.listByArticle(this.selectedArticleId)
      : this.addonsService.list();

    fetch$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.addons = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load add-ons.')
      });
  }
}
