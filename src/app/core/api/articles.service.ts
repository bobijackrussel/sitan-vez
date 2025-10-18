import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ArtikalFilterDTO,
  ArtikalRequestDTO,
  ArtikalResponseDTO,
  ArtikalVarijacijeDTO
} from './api.models';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly baseUrl = `${environment.api}/artikli`;

  constructor(private http: HttpClient) {}

  list(params?: { page?: number; size?: number; search?: string; krojacUsername?: string }): Observable<ArtikalResponseDTO[]> {
    let httpParams = new HttpParams();
    if (params?.page !== undefined) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.size !== undefined) { httpParams = httpParams.set('size', params.size.toString()); }
    if (params?.search) { httpParams = httpParams.set('q', params.search); }
    if (params?.krojacUsername) { httpParams = httpParams.set('krojacUsername', params.krojacUsername); }
    return this.http.get<ArtikalResponseDTO[]>(this.baseUrl, { params: httpParams });
  }

  get(id: number): Observable<ArtikalResponseDTO> {
    return this.http.get<ArtikalResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(payload: ArtikalRequestDTO): Observable<ArtikalResponseDTO> {
    return this.http.post<ArtikalResponseDTO>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<ArtikalRequestDTO>): Observable<ArtikalResponseDTO> {
    return this.http.put<ArtikalResponseDTO>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  filter(filter: Partial<ArtikalFilterDTO>): Observable<ArtikalResponseDTO[]> {
    return this.http.post<ArtikalResponseDTO[]>(`${this.baseUrl}/filter`, filter);
  }

  variations(filter: Partial<ArtikalFilterDTO>): Observable<ArtikalVarijacijeDTO> {
    return this.http.post<ArtikalVarijacijeDTO>(`${this.baseUrl}/varijacije`, filter);
  }

  image(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/slika`, { responseType: 'blob' });
  }
}
