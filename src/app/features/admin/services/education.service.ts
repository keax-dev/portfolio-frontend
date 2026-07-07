import { Education, EducationPayload } from '@shared/interfaces/education';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  reference = '/education';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  getEducationList(): Observable<ApiResponse<Education[]>> {
    return this.http.get<ApiResponse<Education[]>>(`${this.baseUrl}${this.reference}`);
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
