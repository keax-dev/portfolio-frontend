import { Institution, InstitutionPayload } from '@shared/interfaces/institution';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  reference = '/institution';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  getInstitutionList(): Observable<ApiResponse<Institution[]>> {
    return this.http.get<ApiResponse<Institution[]>>(`${this.baseUrl}${this.reference}`);
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
