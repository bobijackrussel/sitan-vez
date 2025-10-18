import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArtikalDodatakResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class AddonsService {
  private readonly baseUrl = `${environment.api}/artikal-dodaci`;

  constructor(private http: HttpClient) {}

  list(filters?: { search?: string; artikalId?: number }): Observable<ArtikalDodatakResponse[]> {
    let params = new HttpParams();
    if (filters?.search) { params = params.set('q', filters.search); }
    if (filters?.artikalId) { params = params.set('artikalId', filters.artikalId); }
    return this.http.get<ArtikalDodatakResponse[]>(this.baseUrl, { params });
  }

  listByArticle(artikalId: number): Observable<ArtikalDodatakResponse[]> {
    return this.http.get<ArtikalDodatakResponse[]>(`${this.baseUrl}/artikal/${artikalId}`);
  }

  get(id: number): Observable<ArtikalDodatakResponse> {
    return this.http.get<ArtikalDodatakResponse>(`${this.baseUrl}/${id}`);
  }

  create(body: FormData | Record<string, unknown>): Observable<ArtikalDodatakResponse> {
    return this.http.post<ArtikalDodatakResponse>(this.baseUrl, body);
  }

  update(id: number, body: FormData | Record<string, unknown>): Observable<ArtikalDodatakResponse> {
    return this.http.put<ArtikalDodatakResponse>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  image(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/slika`, { responseType: 'blob' });
  }
}
