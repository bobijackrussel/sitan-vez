import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SabloniService } from '../../../../core/api/sabloni.service';
import { KreacijeService } from '../../../../core/api/kreacije.service';
import { ArticlesService } from '../../../../core/api/articles.service';
import { ClientsService } from '../../../../core/api/clients.service';
import { TailorContextService } from '../../services/tailor-context.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SablonResponseDTO, SablonRequestDTO, KreacijaResponseDTO, KreacijaRequestDTO, ArtikalResponseDTO, ClientSummary } from '../../../../core/api/api.models';

@Component({
  selector: 'app-assets',
  standalone: false,
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css'
})
export class AssetsComponent implements OnInit, OnDestroy {
  patternForm: FormGroup;
  creationForm: FormGroup;

  patterns: SablonResponseDTO[] = [];
  creations: KreacijaResponseDTO[] = [];
  articles: ArtikalResponseDTO[] = [];
  clients: ClientSummary[] = [];

  loadingPatterns = false;
  loadingCreations = false;
  savingPattern = false;
  savingCreation = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly sabloni: SabloniService,
    private readonly kreacije: KreacijeService,
    private readonly articlesService: ArticlesService,
    private readonly clientsService: ClientsService,
    private readonly context: TailorContextService,
    private readonly toast: ToastService
  ) {
    this.patternForm = this.fb.group({
      artikalId: ['', Validators.required],
      cijena: ['', Validators.required],
      slikaBase64: ['', Validators.required]
    });

    this.creationForm = this.fb.group({
      klijentId: ['', Validators.required],
      slikaBase64: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.context.ensureTailor()) {
      return;
    }
    this.loadArticles();
    this.loadClients();
    this.loadPatterns();
    this.loadCreations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  savePattern(): void {
    if (this.patternForm.invalid) {
      this.patternForm.markAllAsTouched();
      return;
    }

    const payload: SablonRequestDTO = {
      artikalId: Number(this.patternForm.value.artikalId),
      cijena: Number(this.patternForm.value.cijena),
      slikaBase64: this.patternForm.value.slikaBase64
    };

    this.savingPattern = true;
    this.sabloni.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.savingPattern = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Pattern saved.');
          this.patternForm.reset();
          this.loadPatterns();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save pattern.';
          this.toast.error(message);
        }
      });
  }

  removePattern(pattern: SablonResponseDTO): void {
    this.sabloni.delete(pattern.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Pattern removed.');
          this.loadPatterns();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove pattern.';
          this.toast.error(message);
        }
      });
  }

  saveCreation(): void {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();
      return;
    }

    const payload: KreacijaRequestDTO = {
      klijentId: Number(this.creationForm.value.klijentId),
      slikaBase64: this.creationForm.value.slikaBase64
    };

    this.savingCreation = true;
    this.kreacije.create(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.savingCreation = false; })
      )
      .subscribe({
        next: () => {
          this.toast.success('Creation saved.');
          this.creationForm.reset();
          this.loadCreations();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to save creation.';
          this.toast.error(message);
        }
      });
  }

  removeCreation(creation: KreacijaResponseDTO): void {
    this.kreacije.delete(creation.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success('Creation removed.');
          this.loadCreations();
        },
        error: err => {
          const message = typeof err === 'string' ? err : 'Unable to remove creation.';
          this.toast.error(message);
        }
      });
  }

  private loadPatterns(): void {
    this.loadingPatterns = true;
    this.sabloni.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingPatterns = false; })
      )
      .subscribe({
        next: list => this.patterns = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load patterns.')
      });
  }

  private loadCreations(): void {
    this.loadingCreations = true;
    this.kreacije.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingCreations = false; })
      )
      .subscribe({
        next: list => this.creations = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load creations.')
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

  private loadClients(): void {
    this.clientsService.list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => this.clients = list,
        error: err => this.toast.error(typeof err === 'string' ? err : 'Unable to load clients.')
      });
  }
}
