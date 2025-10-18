import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MjereRequestDTO, MjereResponseDTO, UsernameRequest } from './api.models';

@Injectable({ providedIn: 'root' })
export class MeasurementsService {
  private readonly baseUrl = `${environment.api}/mjere`;

  constructor(private http: HttpClient) {}

  list(request: UsernameRequest, aktivne?: number): Observable<MjereResponseDTO[]> {
    return this.http.request<MjereResponseDTO[]>('GET', this.baseUrl, {
      body: request,
      params: aktivne !== undefined ? { aktivne: aktivne.toString() } : undefined
    });
  }

  latest(request: UsernameRequest): Observable<MjereResponseDTO> {
    return this.http.request<MjereResponseDTO>('GET', `${this.baseUrl}/latest`, { body: request });
  }

  create(payload: MjereRequestDTO): Observable<MjereResponseDTO> {
    return this.http.post<MjereResponseDTO>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<MjereRequestDTO>): Observable<MjereResponseDTO> {
    return this.http.put<MjereResponseDTO>(`${this.baseUrl}/${id}`, payload);
  }
}
