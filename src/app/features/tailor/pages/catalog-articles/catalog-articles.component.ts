import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ArticlesService } from '../../../../core/api/articles.service';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ArtikalResponseDTO, ArtikalRequestDTO, DictionaryEntity } from '../../../../core/api/api.models';

@Component({
  selector: 'app-catalog-articles',
  standalone: false,
  templateUrl: './catalog-articles.component.html',
  styleUrl: './catalog-articles.component.css'
})
export class CatalogArticlesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  articles: ArtikalResponseDTO[] = [];
  colors: string[] = [];
  materials: string[] = [];
  qualities: string[] = [];
  categories: string[] = [];
  subcategories: string[] = [];

  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly articlesService: ArticlesService,
    private readonly dictionaries: DictionariesService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      naziv: ['', Validators.required],
      materijal: ['', Validators.required],
      boja: ['', Validators.required],
      velicina: ['', Validators.required],
      kolicina: [1, [Validators.required, Validators.min(0)]],
      kvalitet: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: [''],
      slikaBase64: ['']
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadDictionaries();
    this.loadArticles();
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

    const raw = this.form.value;
    const payload: ArtikalRequestDTO = {
      bojaNaziv: raw.boja,
      kategorije: [{ kategorijaNaziv: raw.category, podkategorijaNaziv: raw.subcategory || raw.category }],
      kolicina: Number(raw.kolicina),
      krojacUsername: this.context.username,
      kvalitetMaterijalaKvalitet: raw.kvalitet,
      materijalNaziv: raw.materijal,
      naziv: raw.naziv,
      slikaBase64: raw.slikaBase64 || '',
      velicina: raw.velicina
    };

    this.saving = true;
    this.articlesService.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Article saved.');
          this.form.reset({ kolicina: 1 });
          this.loadArticles();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save article.';
          this.toast.error(message);
        }
      });
  }

  remove(article: ArtikalResponseDTO): void {
    this.articlesService.delete(article.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success(`Removed ${article.naziv}.`);
          this.loadArticles();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to delete article.';
          this.toast.error(message);
        }
      });
  }

  private loadArticles(): void {
    this.loading = true;
    this.articlesService.list({ krojacUsername: this.context.username })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => {
          this.articles = list;
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to load articles.';
          this.toast.error(message);
        }
      });
  }

  private loadDictionaries(): void {
    forkJoin({
      colors: this.dictionaries.colors(),
      materials: this.dictionaries.materials(),
      qualities: this.dictionaries.qualities(),
      categories: this.dictionaries.categories(),
      subcategories: this.dictionaries.subcategories()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ colors, materials, qualities, categories, subcategories }) => {
        this.colors = this.mapNames(colors);
        this.materials = this.mapNames(materials);
        this.qualities = this.mapNames(qualities);
        this.categories = this.mapNames(categories);
        this.subcategories = this.mapNames(subcategories);
      });
  }

  private mapNames(entries: DictionaryEntity[]): string[] {
    return entries
      .map(entry => entry.naziv || '')
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }
}
