import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OrderItemSummary,
  StavkaNarudzbeDTO,
  StavkaNarudzbeFilterDTO
} from './api.models';
import { environment } from '../../../environments/environment';

export interface CreateOrderItemPayload {
  narudzbaId: number;
  ponudaId: number;
  mjereId: number;
  kolicina: number;
  dodaciIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class OrderItemsService {
  private readonly baseUrl = `${environment.api}/stavke`;

  constructor(private http: HttpClient) {}

  list(params?: { narudzbaId?: number; status?: string; page?: number; size?: number }): Observable<OrderItemSummary[]> {
    let httpParams = new HttpParams();
    if (params?.narudzbaId !== undefined) { httpParams = httpParams.set('narudzbaId', params.narudzbaId.toString()); }
    if (params?.status) { httpParams = httpParams.set('status', params.status); }
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.get<OrderItemSummary[]>(this.baseUrl, { params: httpParams });
  }

  filter(filter: Partial<StavkaNarudzbeFilterDTO>): Observable<OrderItemSummary[]> {
    return this.http.post<OrderItemSummary[]>(`${this.baseUrl}/filter`, filter);
  }

  get(id: number): Observable<OrderItemSummary> {
    return this.http.get<OrderItemSummary>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateOrderItemPayload): Observable<OrderItemSummary> {
    return this.http.post<OrderItemSummary>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<StavkaNarudzbeDTO>): Observable<OrderItemSummary> {
    return this.http.put<OrderItemSummary>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setStatus(id: number, status: string): Observable<OrderItemSummary> {
    return this.http.patch<OrderItemSummary>(`${this.baseUrl}/${id}/status`, { statusStavkeNaziv: status });
  }

  setDeposit(id: number, paid: boolean): Observable<OrderItemSummary> {
    return this.http.patch<OrderItemSummary>(`${this.baseUrl}/${id}/uplacen-avans`, { uplacenAvans: paid ? 1 : 0 });
  }

  setCancelDate(id: number, datum: string): Observable<OrderItemSummary> {
    return this.http.patch<OrderItemSummary>(`${this.baseUrl}/${id}/datum-otkazivanja`, { datumOtkazivanja: datum });
  }

  setCancelDeadline(id: number, datum: string): Observable<OrderItemSummary> {
    return this.http.patch<OrderItemSummary>(`${this.baseUrl}/${id}/rok-za-otkazivanje`, { rokZaOtkazivanje: datum });
  }
}
