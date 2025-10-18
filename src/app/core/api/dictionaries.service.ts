import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DictionaryEntity,
  KategorijaPodkategorijaRequest,
  KategorijaPodkategorijaResponse
} from './api.models';

type DictionarySegment =
  | 'drzave'
  | 'boje'
  | 'materijali'
  | 'kvaliteti'
  | 'kategorije'
  | 'podkategorije'
  | 'statusi-narudzbe'
  | 'statusi-stavki';

@Injectable({ providedIn: 'root' })
export class DictionariesService {
  private readonly baseUrl = environment.api;

  constructor(private http: HttpClient) {}

  private list(segment: DictionarySegment, params?: { search?: string }): Observable<DictionaryEntity[]> {
    let httpParams = new HttpParams();
    if (params?.search) { httpParams = httpParams.set('q', params.search); }
    const target = `${this.baseUrl}/${segment}`;
    return this.http.get<DictionaryEntity[]>(params?.search ? `${target}/search` : target, { params: httpParams });
  }

  private create(segment: DictionarySegment, payload: DictionaryEntity): Observable<DictionaryEntity> {
    return this.http.post<DictionaryEntity>(`${this.baseUrl}/${segment}`, payload);
  }

  private update(segment: DictionarySegment, id: number, payload: DictionaryEntity): Observable<DictionaryEntity> {
    return this.http.put<DictionaryEntity>(`${this.baseUrl}/${segment}/${id}`, payload);
  }

  private remove(segment: DictionarySegment, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${segment}/${id}`);
  }

  countries(search?: string) { return this.list('drzave', search ? { search } : undefined); }
  createCountry(payload: DictionaryEntity) { return this.create('drzave', payload); }
  updateCountry(id: number, payload: DictionaryEntity) { return this.update('drzave', id, payload); }
  deleteCountry(id: number) { return this.remove('drzave', id); }

  colors(search?: string) { return this.list('boje', search ? { search } : undefined); }
  createColor(payload: DictionaryEntity) { return this.create('boje', payload); }
  updateColor(id: number, payload: DictionaryEntity) { return this.update('boje', id, payload); }
  deleteColor(id: number) { return this.remove('boje', id); }

  materials(search?: string) { return this.list('materijali', search ? { search } : undefined); }
  createMaterial(payload: DictionaryEntity) { return this.create('materijali', payload); }
  updateMaterial(id: number, payload: DictionaryEntity) { return this.update('materijali', id, payload); }
  deleteMaterial(id: number) { return this.remove('materijali', id); }

  qualities(search?: string) { return this.list('kvaliteti', search ? { search } : undefined); }
  createQuality(payload: DictionaryEntity) { return this.create('kvaliteti', payload); }
  updateQuality(id: number, payload: DictionaryEntity) { return this.update('kvaliteti', id, payload); }
  deleteQuality(id: number) { return this.remove('kvaliteti', id); }

  categories(search?: string) { return this.list('kategorije', search ? { search } : undefined); }
  createCategory(payload: DictionaryEntity) { return this.create('kategorije', payload); }
  updateCategory(id: number, payload: DictionaryEntity) { return this.update('kategorije', id, payload); }
  deleteCategory(id: number) { return this.remove('kategorije', id); }

  subcategories(search?: string) { return this.list('podkategorije', search ? { search } : undefined); }
  createSubcategory(payload: DictionaryEntity) { return this.create('podkategorije', payload); }
  updateSubcategory(id: number, payload: DictionaryEntity) { return this.update('podkategorije', id, payload); }
  deleteSubcategory(id: number) { return this.remove('podkategorije', id); }

  orderStatuses(search?: string) { return this.list('statusi-narudzbe', search ? { search } : undefined); }
  createOrderStatus(payload: DictionaryEntity) { return this.create('statusi-narudzbe', payload); }
  updateOrderStatus(id: number, payload: DictionaryEntity) { return this.update('statusi-narudzbe', id, payload); }
  deleteOrderStatus(id: number) { return this.remove('statusi-narudzbe', id); }

  itemStatuses(search?: string) { return this.list('statusi-stavki', search ? { search } : undefined); }
  createItemStatus(payload: DictionaryEntity) { return this.create('statusi-stavki', payload); }
  updateItemStatus(id: number, payload: DictionaryEntity) { return this.update('statusi-stavki', id, payload); }
  deleteItemStatus(id: number) { return this.remove('statusi-stavki', id); }

  categoryMappings(): Observable<KategorijaPodkategorijaResponse[]> {
    return this.http.get<KategorijaPodkategorijaResponse[]>(`${this.baseUrl}/kategorija-podkategorija`);
  }

  categoryMappingsFor(categoryNaziv: string): Observable<KategorijaPodkategorijaResponse[]> {
    return this.http.get<KategorijaPodkategorijaResponse[]>(
      `${this.baseUrl}/kategorija-podkategorija/kategorija/${encodeURIComponent(categoryNaziv)}/podkategorije`
    );
  }

  createCategoryMapping(payload: KategorijaPodkategorijaRequest): Observable<KategorijaPodkategorijaResponse> {
    return this.http.post<KategorijaPodkategorijaResponse>(`${this.baseUrl}/kategorija-podkategorija`, payload);
  }

  updateCategoryMapping(id: number, payload: KategorijaPodkategorijaRequest): Observable<KategorijaPodkategorijaResponse> {
    return this.http.put<KategorijaPodkategorijaResponse>(`${this.baseUrl}/kategorija-podkategorija/${id}`, payload);
  }

  deleteCategoryMapping(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/kategorija-podkategorija/${id}`);
  }
}
