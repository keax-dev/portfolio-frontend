import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Technology, TechnologyPayload } from '@shared/interfaces/technology';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  reference = '/technology';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getTechnologyListByDeleted(deleted = false): Observable<ApiResponse<Technology[]>> {
    return this.http.get<ApiResponse<Technology[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createTechnology(payload: TechnologyPayload): Observable<ApiResponse<Technology>> {
    return this.http.post<ApiResponse<Technology>>(this.baseUrl + this.reference, payload);
  }

  updateTechnology(
    technologyId: number,
    payload: TechnologyPayload,
  ): Observable<ApiResponse<Technology>> {
    return this.http.put<ApiResponse<Technology>>(
      `${this.baseUrl}${this.reference}/${technologyId}`,
      payload,
    );
  }

  deleteTechnology(technologyId: number): Observable<ApiResponse<Technology[]>> {
    return this.http.delete<ApiResponse<Technology[]>>(
      `${this.baseUrl}${this.reference}/${technologyId}`,
    );
  }
}
