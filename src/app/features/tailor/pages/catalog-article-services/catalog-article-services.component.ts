import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ArtikalUslugaService } from '../../../../core/api/artikal-usluga.service';
import { ArticlesService } from '../../../../core/api/articles.service';
import { UslugeService } from '../../../../core/api/usluge.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ArtikalUslugaResponseDTO, ArtikalUslugaRequestDTO, ArtikalResponseDTO, DictionaryEntity } from '../../../../core/api/api.models';

@Component({
  selector: 'app-catalog-article-services',
  standalone: false,
  templateUrl: './catalog-article-services.component.html',
  styleUrl: './catalog-article-services.component.css'
})
export class CatalogArticleServicesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  mappings: ArtikalUslugaResponseDTO[] = [];
  articles: ArtikalResponseDTO[] = [];
  services: DictionaryEntity[] = [];

  loading = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly artikalUsluga: ArtikalUslugaService,
    private readonly articlesService: ArticlesService,
    private readonly uslugeService: UslugeService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      artikalId: ['', Validators.required],
      uslugaNaziv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadArticles();
    this.loadServices();
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

    const payload: ArtikalUslugaRequestDTO = {
      artikalId: Number(this.form.value.artikalId),
      uslugaNaziv: this.form.value.uslugaNaziv
    };

    this.saving = true;
    this.artikalUsluga.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.saving = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Mapping saved.');
          this.form.reset();
          this.loadMappings();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save mapping.';
          this.toast.error(message);
        }
      });
  }

  remove(mapping: ArtikalUslugaResponseDTO): void {
    this.artikalUsluga.delete(mapping.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Mapping removed.');
          this.loadMappings();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove mapping.';
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

  private loadServices(): void {
    this.uslugeService.list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.services = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load services.')
      });
  }

  private loadMappings(): void {
    this.loading = true;
    this.artikalUsluga.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: list => this.mappings = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load mappings.')
      });
  }

  articleName(id: number): string {
    const article = this.articles.find(item => item.id === id);
    return article?.naziv || `#${id}`;
  }

  serviceLabel(name: string | undefined): string {
    if (!name) { return ''; }
    const service = this.services.find(item => item.naziv === name);
    return service?.naziv || name;
  }
}
