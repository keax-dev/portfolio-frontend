import { Institution, InstitutionPayload } from '@shared/interfaces/institution';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private readonly resource = new CrudResourceClient<Institution, InstitutionPayload>(
    inject(HttpClient),
    `${environment.url}/institution`,
  );

  getInstitutionList(): Observable<ApiResponse<Institution[]>> {
    return this.resource.list();
  }

  createInstitution(payload: InstitutionPayload): Observable<ApiResponse<Institution>> {
    return this.resource.create(payload);
  }

  updateInstitution(
    institutionId: number,
    payload: InstitutionPayload,
  ): Observable<ApiResponse<Institution>> {
    return this.resource.update(institutionId, payload);
  }

  deleteInstitution(institutionId: number): Observable<ApiResponse<Institution[]>> {
    return this.resource.remove(institutionId);
  }
}
