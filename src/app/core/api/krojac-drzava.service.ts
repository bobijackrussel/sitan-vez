import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KrojacDrzavaRequestDTO, DictionaryEntity } from './api.models';

@Injectable({ providedIn: 'root' })
export class KrojacDrzavaService {
  private readonly baseUrl = `${environment.api}/krojac-drzava`;

  constructor(private http: HttpClient) {}

  list(krojacUsername?: string): Observable<(KrojacDrzavaRequestDTO & DictionaryEntity)[]> {
    let params = new HttpParams();
    if (krojacUsername) { params = params.set('krojacUsername', krojacUsername); }
    return this.http.get<(KrojacDrzavaRequestDTO & DictionaryEntity)[]>(this.baseUrl, { params });
  }

  create(payload: KrojacDrzavaRequestDTO): Observable<KrojacDrzavaRequestDTO> {
    return this.http.post<KrojacDrzavaRequestDTO>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<KrojacDrzavaRequestDTO>): Observable<KrojacDrzavaRequestDTO> {
    return this.http.put<KrojacDrzavaRequestDTO>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
