import { Technology, TechnologyPayload } from '@shared/interfaces/technology';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  reference = '/technology';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

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
