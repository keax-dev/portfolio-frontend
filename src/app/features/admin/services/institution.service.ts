import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { Institution, InstitutionPayload } from '@shared/interfaces/institution';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  reference = '/institution';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getInstitutionListByDeleted(deleted = false): Observable<ApiResponse<Institution[]>> {
    return this.http.get<ApiResponse<Institution[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createInstitution(payload: InstitutionPayload): Observable<ApiResponse<Institution>> {
    return this.http.post<ApiResponse<Institution>>(this.baseUrl + this.reference, payload);
  }

  updateInstitution(
    institutionId: number,
    payload: InstitutionPayload,
  ): Observable<ApiResponse<Institution>> {
    return this.http.put<ApiResponse<Institution>>(
      `${this.baseUrl}${this.reference}/${institutionId}`,
      payload,
    );
  }

  deleteInstitution(institutionId: number): Observable<ApiResponse<Institution[]>> {
    return this.http.delete<ApiResponse<Institution[]>>(
      `${this.baseUrl}${this.reference}/${institutionId}`,
    );
  }
}
