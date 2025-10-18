import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffersService } from '../../../../core/api/offers.service';
import { KreacijeService } from '../../../../core/api/kreacije.service';
import { OfferSummary, Creation } from '../../../../core/api/api.models';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  loadingOffers = false;
  loadingCreations = false;
  heroOffers: OfferSummary[] = [];
  latestCreations: Creation[] = [];
  error?: string;
  readonly placeholderImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20">Creation</text></svg>';

  constructor(
    private router: Router,
    private offers: OffersService,
    private creations: KreacijeService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchHeroOffers();
    this.fetchCreations();
  }

  browseOffers(): void { this.router.navigate(['/public/offers']); }
  signUpClient(): void { this.router.navigate(['/public/register-client']); }
  signUpTailor(): void { this.router.navigate(['/public/register-tailor']); }

  private fetchHeroOffers(): void {
    this.loadingOffers = true;
    this.offers.list({ size: 6 }).subscribe({
      next: page => this.heroOffers = page.content,
      error: () => {
        this.error = 'Unable to load featured offers.';
        this.toast.error(this.error);
      },
      complete: () => this.loadingOffers = false
    });
  }

  private fetchCreations(): void {
    this.loadingCreations = true;
    this.creations.list().subscribe({
      next: creations => this.latestCreations = creations.slice(0, 6),
      error: () => {
        this.error ??= 'Unable to load latest creations.';
        this.toast.error(this.error);
      },
      complete: () => this.loadingCreations = false
    });
  }

  trackByOffer = (_: number, offer: OfferSummary) => offer.id;

  offerTitle(offer: OfferSummary): string {
    if (this.isArticleOffer(offer)) {
      return (
        offer.artikal?.naziv ||
        offer.artikal?.kategorije?.[0]?.podkategorijaNaziv ||
        offer.uslugaNaziv ||
        'Tailor Offer'
      );
    }
    return offer.uslugaNaziv || 'Tailor Offer';
  }

  offerPrice(offer: OfferSummary): number | null {
    return offer.jedinicnaCijena ?? null;
  }

  private isArticleOffer(offer: OfferSummary): offer is OfferSummary & { artikal: any } {
    return 'artikal' in offer && !!(offer as any).artikal;
  }
}
