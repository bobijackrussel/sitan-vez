import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { OffersService } from '../../../../core/api/offers.service';
import {
  OfferSummary,
  DictionaryEntity,
  PageResponse,
  PonudaFilterDTO,
  ArtikalFilterDTO
} from '../../../../core/api/api.models';
import { DictionariesService } from '../../../../core/api/dictionaries.service';
import { UslugeService } from '../../../../core/api/usluge.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';
import { ToastService } from '../../../../shared/services/toast.service';

interface PageState {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-offers-list',
  standalone: false,
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit, OnDestroy {
  filtersForm: FormGroup;
  offers: OfferSummary[] = [];
  loading = false;
  error?: string;
  page: PageState = { number: 0, size: 9, totalElements: 0, totalPages: 0 };

  countries: string[] = [];
  services: string[] = [];
  categories: string[] = [];
  subcategories: string[] = [];
  private allSubcategories: string[] = [];
  private categoryToSubcategories = new Map<string, string[]>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private offersApi: OffersService,
    private dictionaries: DictionariesService,
    private usluge: UslugeService,
    private errors: ApiErrorService,
    private router: Router,
    private toast: ToastService
  ) {
    this.filtersForm = this.fb.group({
      search: [''],
      country: [''],
      service: [''],
      category: [''],
      subcategory: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookupData();
    this.filtersForm.get('category')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(category => this.updateSubcategoryOptions(category));
    this.loadOffers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    if (!this.validatePriceRange()) {
      return;
    }
    this.page.number = 0;
    this.loadOffers();
  }

  resetFilters(): void {
    this.filtersForm.reset({
      search: '',
      country: '',
      service: '',
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: ''
    });
    this.error = undefined;
    this.applyFilters();
  }

  openOffer(offer: OfferSummary): void {
    this.router.navigate(['/public/offers', offer.id]);
  }

  previousPage(): void {
    if (this.page.number > 0) {
      this.page.number -= 1;
      this.loadOffers(false);
    }
  }

  nextPage(): void {
    if (this.page.number + 1 < this.page.totalPages) {
      this.page.number += 1;
      this.loadOffers(false);
    }
  }

  trackByOffer = (_: number, offer: OfferSummary) => offer.id;

  displayTitle(offer: OfferSummary): string {
    if ('artikal' in offer && offer.artikal) {
      return (
        offer.artikal.naziv ||
        offer.artikal.kategorije?.[0]?.podkategorijaNaziv ||
        offer.uslugaNaziv ||
        'Tailor offer'
      );
    }
    return offer.uslugaNaziv || 'Tailor offer';
  }

  displaySubtitle(offer: OfferSummary): string {
    if ('artikal' in offer && offer.artikal) {
      const bits = [
        offer.artikal.materijalNaziv,
        offer.artikal.bojaNaziv,
        offer.artikal.velicina
      ].filter(Boolean);
      return bits.join(' | ');
    }
    return offer.uslugaNaziv ?? '';
  }

  tailorName(offer: OfferSummary): string {
    return offer.krojacUsername || 'N/A';
  }

  priceValue(offer: OfferSummary): number | null {
    return offer.jedinicnaCijena ?? null;
  }

  leadTime(offer: OfferSummary): number | null {
    return 'brojDanaZaIzradu' in offer ? (offer as any).brojDanaZaIzradu ?? null : null;
  }

  cancelWindow(offer: OfferSummary): number | null {
    return 'brojDanaZaOtkazivanje' in offer ? (offer as any).brojDanaZaOtkazivanje ?? null : null;
  }

  hasDiscount(offer: OfferSummary): boolean {
    return !!offer.procenatPopusta;
  }

  hasRushFee(offer: OfferSummary): boolean {
    return !!offer.procenatZaHitnost;
  }

  private loadLookupData(): void {
    forkJoin({
      countries: this.dictionaries.countries(),
      services: this.usluge.list(),
      categories: this.dictionaries.categories(),
      subcategories: this.dictionaries.subcategories(),
      mappings: this.dictionaries.categoryMappings()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ countries, services, categories, subcategories, mappings }) => {
          this.countries = this.mapNames(countries);
          this.services = this.mapNames(services);
          this.categories = this.mapNames(categories);
          this.allSubcategories = this.mapNames(subcategories);
          mappings.forEach(mapping => {
            const existing = this.categoryToSubcategories.get(mapping.kategorijaNaziv) ?? [];
            if (!existing.includes(mapping.podkategorijaNaziv)) {
              existing.push(mapping.podkategorijaNaziv);
              this.categoryToSubcategories.set(mapping.kategorijaNaziv, existing);
            }
          });
          this.updateSubcategoryOptions(this.filtersForm.get('category')?.value);
        },
        error: err => {
          this.error = this.errors.extractMessage(err);
          this.toast.error(this.error);
        }
      });
  }

  private mapNames(entities: DictionaryEntity[]): string[] {
    return entities
      .map(entity => entity.naziv || '')
      .filter((naziv): naziv is string => !!naziv)
      .sort((a, b) => a.localeCompare(b));
  }

  private updateSubcategoryOptions(category: string | null | undefined): void {
    if (!category) {
      const mappedSubs = Array.from(
        new Set(
          Array.from(this.categoryToSubcategories.values()).flat()
        )
      );
      this.subcategories = (mappedSubs.length ? mappedSubs : this.allSubcategories)
        .slice()
        .sort((a, b) => a.localeCompare(b));
      return;
    }
    const scoped = this.categoryToSubcategories.get(category);
    this.subcategories = scoped ? [...scoped].sort((a, b) => a.localeCompare(b)) : [];
    if (this.filtersForm.get('subcategory')?.value && !this.subcategories.includes(this.filtersForm.get('subcategory')?.value)) {
      this.filtersForm.get('subcategory')?.setValue('');
    }
  }

  private loadOffers(resetError = true): void {
    if (resetError) {
      this.error = undefined;
    }
    this.loading = true;
    const filter = this.buildFilterPayload();
    const params = { page: this.page.number, size: this.page.size };
    const request$ = filter
      ? this.offersApi.filter(filter, params)
      : this.offersApi.list(params);

    request$
      .pipe(finalize(() => this.loading = false), takeUntil(this.destroy$))
      .subscribe({
        next: (page: PageResponse<OfferSummary>) => {
          this.offers = page.content;
          this.page = {
            number: page.number,
            size: page.size,
            totalElements: page.totalElements,
            totalPages: page.totalPages
          };
          if (this.offers.length === 0 && page.totalElements === 0 && filter) {
            this.error = 'No offers match the selected filters.';
            this.toast.info(this.error);
          }
        },
        error: err => {
          this.error = this.errors.extractMessage(err);
          this.toast.error(this.error);
        }
      });
  }

  private buildFilterPayload(): Partial<PonudaFilterDTO> | null {
    const raw = this.filtersForm.value;
    const filter: Partial<PonudaFilterDTO> = {};
    const artikalFilter: ArtikalFilterDTO = {};

    if (raw.search) { artikalFilter.naziv = raw.search; }
    if (raw.category) { artikalFilter.kategorije = [raw.category]; }
    if (raw.subcategory) { artikalFilter.podkategorije = [raw.subcategory]; }

    if (Object.keys(artikalFilter).length > 0) {
      filter.artikalFilter = artikalFilter;
    }

    if (raw.country) { filter.drzave = [raw.country]; }
    if (raw.service) { filter.usluge = [raw.service]; }
    if (raw.minPrice) { filter.minCijena = Number(raw.minPrice); }
    if (raw.maxPrice) { filter.maxCijena = Number(raw.maxPrice); }

    return Object.keys(filter).length ? filter : null;
  }

  private validatePriceRange(): boolean {
    const minRaw = this.filtersForm.get('minPrice')?.value;
    const maxRaw = this.filtersForm.get('maxPrice')?.value;
    if (minRaw !== '' && maxRaw !== '') {
      const min = Number(minRaw);
      const max = Number(maxRaw);
      if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
        this.error = 'Minimum price cannot exceed maximum price.';
        this.toast.warning(this.error);
        return false;
      }
    }
    return true;
  }
}
