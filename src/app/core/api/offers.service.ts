import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OfferSummary,
  PonudaArtikalRequestDTO,
  PonudaArtikalUslugaRequestDTO,
  PonudaFilterDTO,
  PonudaUslugaRequestDTO,
  ArtikalVarijacijeDTO,
  PageResponse
} from './api.models';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private readonly baseUrl = `${environment.api}/ponude`;

  constructor(private http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<OfferSummary>> {
    let httpParams = new HttpParams();
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.get<PageResponse<OfferSummary>>(this.baseUrl, { params: httpParams });
  }

  filter(filter: Partial<PonudaFilterDTO>, params?: { page?: number; size?: number }): Observable<PageResponse<OfferSummary>> {
    let httpParams = new HttpParams();
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.post<PageResponse<OfferSummary>>(`${this.baseUrl}/filter`, filter, { params: httpParams });
  }

  filterVariations(filter: Partial<PonudaFilterDTO>): Observable<ArtikalVarijacijeDTO> {
    return this.http.post<ArtikalVarijacijeDTO>(`${this.baseUrl}/filterVarijacije`, filter);
  }

  byId(id: number): Observable<OfferSummary> {
    return this.http.get<OfferSummary>(`${this.baseUrl}/${id}`);
  }

  createServiceOffer(payload: PonudaUslugaRequestDTO): Observable<OfferSummary> {
    return this.http.post<OfferSummary>(`${this.baseUrl}/usluga`, payload);
  }

  createArticleServiceOffer(payload: PonudaArtikalUslugaRequestDTO): Observable<OfferSummary> {
    return this.http.post<OfferSummary>(`${this.baseUrl}/artikal-usluga`, payload);
  }

  createArticleOffer(payload: PonudaArtikalRequestDTO): Observable<OfferSummary> {
    return this.http.post<OfferSummary>(`${this.baseUrl}/artikal`, payload);
  }
}
