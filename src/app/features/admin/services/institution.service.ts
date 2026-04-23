import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { Institution } from '@shared/models/institution';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  reference = "/institution";

  private header = inject(HeaderService);

  getInstitutionListByDeleted(deleted: boolean = false): Observable<ApiResponse<Institution[]>> {
    return this.header.http.get<ApiResponse<Institution[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createInstitution(institution: Institution): Observable<ApiResponse<Institution>> {
    const { id: _id, ...payload } = institution;
    return this.header.http.post<ApiResponse<Institution>>(this.header.url + this.reference, payload);
  }

  updateInstitution(institutionId: number, institution: Institution): Observable<ApiResponse<Institution>> {
    const { id: _id, ...payload } = institution;
    return this.header.http.put<ApiResponse<Institution>>(this.header.url + this.reference + `/${institutionId}`, payload);
  }

  deleteInstitution(institutionId: number): Observable<ApiResponse<Institution[]>> {
    return this.header.http.delete<ApiResponse<Institution[]>>(this.header.url + this.reference + `/${institutionId}`);
  }

}
