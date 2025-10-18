import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DictionaryEntity } from './api.models';

@Injectable({ providedIn: 'root' })
export class UslugeService {
  private readonly baseUrl = `${environment.api}/usluge`;

  constructor(private http: HttpClient) {}

  list(params?: { search?: string; page?: number; size?: number }): Observable<DictionaryEntity[]> {
    let httpParams = new HttpParams();
    if (params?.search) { httpParams = httpParams.set('q', params.search); }
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    return this.http.get<DictionaryEntity[]>(this.baseUrl, { params: httpParams });
  }

  search(term: string): Observable<DictionaryEntity[]> {
    const params = new HttpParams().set('q', term);
    return this.http.get<DictionaryEntity[]>(`${this.baseUrl}/search`, { params });
  }

  get(id: number | string): Observable<DictionaryEntity> {
    return this.http.get<DictionaryEntity>(`${this.baseUrl}/${id}`);
  }

  create(payload: DictionaryEntity): Observable<DictionaryEntity> {
    return this.http.post<DictionaryEntity>(this.baseUrl, payload);
  }

  update(id: number | string, payload: DictionaryEntity): Observable<DictionaryEntity> {
    return this.http.put<DictionaryEntity>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

