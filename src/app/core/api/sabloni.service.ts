import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SablonRequestDTO, SablonResponseDTO } from './api.models';

@Injectable({ providedIn: 'root' })
export class SabloniService {
  private readonly baseUrl = `${environment.api}/sabloni`;

  constructor(private http: HttpClient) {}

  list(): Observable<SablonResponseDTO[]> {
    return this.http.get<SablonResponseDTO[]>(this.baseUrl);
  }

  listByArticle(artikalId: number): Observable<SablonResponseDTO[]> {
    return this.http.get<SablonResponseDTO[]>(`${this.baseUrl}/artikal/${artikalId}`);
  }

  get(id: number): Observable<SablonResponseDTO> {
    return this.http.get<SablonResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(payload: SablonRequestDTO): Observable<SablonResponseDTO> {
    return this.http.post<SablonResponseDTO>(this.baseUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  image(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/slika`, { responseType: 'blob' });
  }
}
