import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Education, EducationPayload } from '@shared/interfaces/education';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  reference = '/education';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getEducationListByDeleted(deleted = false): Observable<ApiResponse<Education[]>> {
    return this.http.get<ApiResponse<Education[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createEducation(payload: EducationPayload): Observable<ApiResponse<Education>> {
    return this.http.post<ApiResponse<Education>>(this.baseUrl + this.reference, payload);
  }

  updateEducation(
    educationId: number,
    payload: EducationPayload,
  ): Observable<ApiResponse<Education>> {
    return this.http.put<ApiResponse<Education>>(
      `${this.baseUrl}${this.reference}/${educationId}`,
      payload,
    );
  }

  deleteEducation(educationId: number): Observable<ApiResponse<Education[]>> {
    return this.http.delete<ApiResponse<Education[]>>(
      `${this.baseUrl}${this.reference}/${educationId}`,
    );
  }
}
