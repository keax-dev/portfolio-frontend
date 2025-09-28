import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { Institution } from '@app/home/interfaces/institution';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  reference = "/institution";

  private header = inject(HeaderService);

  getInstitutionListByDeleted(deleted: boolean = false): Observable<ApiResponse<Institution[]>> {
    return this.header.http.get<ApiResponse<Institution[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createInstitution(institution: Institution): Observable<ApiResponse<Institution>> {
    delete institution.id;
    return this.header.http.post<ApiResponse<Institution>>(this.header.url + this.reference, institution, this.header.httpOptions);
  }

  updateInstitution(institutionId: number, institution: Institution): Observable<ApiResponse<Institution>> {
    delete institution.id;
    return this.header.http.put<ApiResponse<Institution>>(this.header.url + this.reference + `/${institutionId}`, institution, this.header.httpOptions);
  }

  deleteInstitution(institutionId: number): Observable<ApiResponse<Institution[]>> {
    return this.header.http.delete<ApiResponse<Institution[]>>(this.header.url + this.reference + `/${institutionId}`, this.header.httpOptions);
  }

}
