import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KrojacDrzavaPonudaRequestDTO, KrojacDrzavaPonudaResponseDTO } from './api.models';

@Injectable({ providedIn: 'root' })
export class KrojacDrzavaPonudaService {
  private readonly baseUrl = `${environment.api}/krojac-drzava-ponuda`;

  constructor(private http: HttpClient) {}

  list(params?: { krojacUsername?: string; ponudaId?: number }): Observable<KrojacDrzavaPonudaResponseDTO[]> {
    let httpParams = new HttpParams();
    if (params?.krojacUsername) { httpParams = httpParams.set('krojacUsername', params.krojacUsername); }
    if (params?.ponudaId !== undefined) { httpParams = httpParams.set('ponudaId', params.ponudaId.toString()); }
    return this.http.get<KrojacDrzavaPonudaResponseDTO[]>(this.baseUrl, { params: httpParams });
  }

  create(payload: KrojacDrzavaPonudaRequestDTO): Observable<KrojacDrzavaPonudaResponseDTO> {
    return this.http.post<KrojacDrzavaPonudaResponseDTO>(this.baseUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
