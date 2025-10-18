import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KlijentRegisterDTO, ClientSummary } from './api.models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = `${environment.api}/klijenti`;

  constructor(private http: HttpClient) {}

  list(params?: { search?: string; page?: number; size?: number }): Observable<ClientSummary[]> {
    let httpParams = new HttpParams();
    if (params?.search) { httpParams = httpParams.set('q', params.search); }
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.get<ClientSummary[]>(this.baseUrl, { params: httpParams });
  }

  get(idOrUsername: number | string): Observable<ClientSummary> {
    return this.http.get<ClientSummary>(`${this.baseUrl}/${idOrUsername}`);
  }

  create(payload: KlijentRegisterDTO): Observable<ClientSummary> {
    return this.http.post<ClientSummary>(this.baseUrl, payload);
  }

  delete(idOrUsername: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idOrUsername}`);
  }
}
