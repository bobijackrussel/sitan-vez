import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Creation, KreacijaRequestDTO, KreacijaResponseDTO } from './api.models';

@Injectable({ providedIn: 'root' })
export class KreacijeService {
  private readonly baseUrl = `${environment.api}/kreacije`;

  constructor(private http: HttpClient) {}

  list(): Observable<KreacijaResponseDTO[]> {
    return this.http.get<KreacijaResponseDTO[]>(this.baseUrl);
  }

  listByClient(clientId: number): Observable<KreacijaResponseDTO[]> {
    return this.http.get<KreacijaResponseDTO[]>(`${this.baseUrl}/klijent/${clientId}`);
  }

  get(id: number): Observable<Creation> {
    return this.http.get<Creation>(`${this.baseUrl}/${id}`);
  }

  create(payload: KreacijaRequestDTO): Observable<KreacijaResponseDTO> {
    return this.http.post<KreacijaResponseDTO>(this.baseUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  image(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/slika`, { responseType: 'blob' });
  }
}
