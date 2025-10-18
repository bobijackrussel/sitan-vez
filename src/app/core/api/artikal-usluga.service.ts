import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArtikalUslugaRequestDTO, ArtikalUslugaResponseDTO } from './api.models';

@Injectable({ providedIn: 'root' })
export class ArtikalUslugaService {
  private readonly baseUrl = `${environment.api}/artikal-usluga`;

  constructor(private http: HttpClient) {}

  list(params?: { artikalId?: number; uslugaNaziv?: string }): Observable<ArtikalUslugaResponseDTO[]> {
    let httpParams = new HttpParams();
    if (params?.artikalId !== undefined) {
      httpParams = httpParams.set('artikalId', params.artikalId.toString());
    }
    if (params?.uslugaNaziv) {
      httpParams = httpParams.set('uslugaNaziv', params.uslugaNaziv);
    }
    return this.http.get<ArtikalUslugaResponseDTO[]>(this.baseUrl, { params: httpParams });
  }

  listByService(uslugaNaziv: string): Observable<ArtikalUslugaResponseDTO[]> {
    return this.http.get<ArtikalUslugaResponseDTO[]>(`${this.baseUrl}/usluga/${encodeURIComponent(uslugaNaziv)}`);
  }

  create(payload: ArtikalUslugaRequestDTO): Observable<ArtikalUslugaResponseDTO> {
    return this.http.post<ArtikalUslugaResponseDTO>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<ArtikalUslugaRequestDTO>): Observable<ArtikalUslugaResponseDTO> {
    return this.http.put<ArtikalUslugaResponseDTO>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
