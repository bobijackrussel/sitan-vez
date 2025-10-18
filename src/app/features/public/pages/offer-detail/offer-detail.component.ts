import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, forkJoin } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { OffersService } from '../../../../core/api/offers.service';
import {
  OfferSummary,
  ArtikalVarijacijeDTO,
  ArtikalDodatakResponse,
  KrojacDrzavaPonudaResponseDTO,
  PonudaFilterDTO,
  ArtikalResponseDTO
} from '../../../../core/api/api.models';
import { KrojacDrzavaPonudaService } from '../../../../core/api/krojac-drzava-ponuda.service';
import { AddonsService } from '../../../../core/api/addons.service';
import { ApiErrorService } from '../../../../core/http/api-error.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-offer-detail',
  standalone: false,
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit, OnDestroy {
  offer?: OfferSummary;
  loading = false;
  error?: string;
  countries: string[] = [];
  addons: ArtikalDodatakResponse[] = [];
  variations?: ArtikalVarijacijeDTO | null;
  readonly placeholderImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260"><rect width="100%" height="100%" fill="%23f9fafb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="22">Offer preview</text></svg>';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private offersApi: OffersService,
    private krojacDrzavaPonuda: KrojacDrzavaPonudaService,
    private addonsService: AddonsService,
    private auth: AuthService,
    private errors: ApiErrorService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Offer not found.';
      this.toast.error(this.error);
      return;
    }
    this.loading = true;
    this.offersApi.byId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: offer => {
          this.offer = offer;
          this.loadSupportingData(offer);
        },
        error: err => {
          this.error = this.errors.extractMessage(err);
          this.toast.error(this.error);
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get article(): ArtikalResponseDTO | undefined {
    if (!this.offer) { return undefined; }
    return this.isArticleOffer(this.offer) ? this.offer.artikal : undefined;
  }

  get imageUrl(): string {
    return this.article?.slikaUrl || this.placeholderImage;
  }

  get hasDiscount(): boolean {
    return !!this.offer && !!this.offer.procenatPopusta;
  }

  get hasRushFee(): boolean {
    return !!this.offer && !!this.offer.procenatZaHitnost;
  }

  get leadTime(): number | null {
    if (!this.offer) { return null; }
    return 'brojDanaZaIzradu' in this.offer ? (this.offer as any).brojDanaZaIzradu ?? null : null;
  }

  get cancelWindow(): number | null {
    if (!this.offer) { return null; }
    return 'brojDanaZaOtkazivanje' in this.offer ? (this.offer as any).brojDanaZaOtkazivanje ?? null : null;
  }

  addToOrder(): void {
    if (!this.offer) { return; }
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Sign in to add offers to your order.');
      this.router.navigate(['/public/login'], { queryParams: { redirect: this.router.url } });
      return;
    }
    this.router.navigate(['/client/order/new'], { queryParams: { offerId: this.offer.id } });
  }

  private loadSupportingData(offer: OfferSummary): void {
    const artikalId = this.isArticleOffer(offer) ? offer.artikal?.id : undefined;
    const filter$ = this.buildVariationsRequest(offer);
    forkJoin({
      countries: this.krojacDrzavaPonuda.list({ ponudaId: offer.id }),
      addons: artikalId ? this.addonsService.listByArticle(artikalId) : of([]),
      variations: filter$
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: ({ countries, addons, variations }) => {
          this.countries = countries.map((c: KrojacDrzavaPonudaResponseDTO) => c.drzavaNaziv).sort((a, b) => a.localeCompare(b));
          this.addons = addons;
          this.variations = variations;
        },
        error: err => {
          this.error = this.errors.extractMessage(err);
          this.toast.error(this.error);
        }
      });
  }

  private buildVariationsRequest(offer: OfferSummary) {
    if (!this.isArticleOffer(offer) || !offer.artikal) {
      return of<ArtikalVarijacijeDTO | null>(null);
    }
    const artikal = offer.artikal;
    const filter: PonudaFilterDTO = {
      artikalFilter: {
        naziv: artikal.naziv,
        krojacUsername: offer.krojacUsername,
        kategorije: artikal.kategorije?.map(k => k.kategorijaNaziv).filter(Boolean),
        podkategorije: artikal.kategorije?.map(k => k.podkategorijaNaziv).filter(Boolean)
      },
      krojacUsername: offer.krojacUsername ? offer.krojacUsername : undefined,
      usluge: offer.uslugaNaziv ? [offer.uslugaNaziv] : undefined
    };
    return this.offersApi.filterVariations(filter).pipe(
      catchError(() => of<ArtikalVarijacijeDTO | null>(null))
    );
  }

  private isArticleOffer(offer: OfferSummary): offer is OfferSummary & { artikal: ArtikalResponseDTO } {
    return 'artikal' in offer && !!offer.artikal;
  }
}
