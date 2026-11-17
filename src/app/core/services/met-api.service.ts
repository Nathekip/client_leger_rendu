import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { MetObject, MetSearchResults } from '../models/met-object';

const API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

@Injectable({ providedIn: 'root' })
export class MetApiService {
  private readonly http = inject(HttpClient);

  getDepartments(): Observable<{ departments: Department[] }> {
    return this.http.get<{ departments: Department[] }>(`${API_URL}/departments`);
  }

  searchObjects(
    query: string,
    departmentId: number | null,
    limit: number,
    offset: number,
  ): Observable<MetSearchResults> {
    let params = new HttpParams()
      .set('q', query.trim())
      .set('hasImages', 'true')
      .set('limit', limit)
      .set('offset', offset);

    if (departmentId !== null) {
      params = params.set('departmentId', departmentId);
    }

    return this.http.get<MetSearchResults>(`${API_URL}.1/search`, { params });
  }

  getObject(objectId: number): Observable<MetObject> {
    return this.http.get<MetObject>(`${API_URL}/objects/${objectId}`);
  }
}
