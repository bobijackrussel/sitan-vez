import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NarudzbaDTO,
  NarudzbaFilterDTO
} from './api.models';
import { environment } from '../../../environments/environment';

export interface NarudzbaPage {
  content: NarudzbaDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateNarudzbaRequest {
  krojacUsername: string;
  napomena?: string;
}

export interface UpdateDatumOtkazivanjaRequest { datumOtkazivanja: string; }
export interface UpdateRokZaOtkazivanjeRequest { rokZaOtkazivanje: string; }
export interface UpdateAvansRequest { uplacenAvans: number; }
export interface UpdateStatusRequest { status: string; }

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly baseUrl = `${environment.api}/narudzbe`;

  constructor(private http: HttpClient) {}

  list(): Observable<NarudzbaDTO[]> {
    return this.http.get<NarudzbaDTO[]>(this.baseUrl);
  }

  filter(filter: Partial<NarudzbaFilterDTO>, params?: { page?: number; size?: number }): Observable<NarudzbaPage> {
    let httpParams = new HttpParams();
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.post<NarudzbaPage>(`${this.baseUrl}/filter`, filter, { params: httpParams });
  }

  get(id: number): Observable<NarudzbaDTO> {
    return this.http.get<NarudzbaDTO>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateNarudzbaRequest): Observable<NarudzbaDTO> {
    return this.http.post<NarudzbaDTO>(this.baseUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<NarudzbaDTO> {
    return this.http.patch<NarudzbaDTO>(`${this.baseUrl}/${id}/status`, { status, statusNarudzbeNaziv: status });
  }

  updateDeposit(id: number, uplacenAvans: number): Observable<NarudzbaDTO> {
    return this.http.patch<NarudzbaDTO>(`${this.baseUrl}/${id}/uplacen-avans`, { uplacenAvans, uplacenAvansBool: !!uplacenAvans });
  }

  updateCancellationDate(id: number, datumOtkazivanja: string): Observable<NarudzbaDTO> {
    return this.http.patch<NarudzbaDTO>(`${this.baseUrl}/${id}/datum-otkazivanja`, { datumOtkazivanja });
  }

  updateCancellationDeadline(id: number, rokZaOtkazivanje: string): Observable<NarudzbaDTO> {
    return this.http.patch<NarudzbaDTO>(`${this.baseUrl}/${id}/rok-za-otkazivanje`, { rokZaOtkazivanje });
  }
}
