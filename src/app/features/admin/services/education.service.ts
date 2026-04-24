import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Education } from '@shared/models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  reference = "/education";

  private header = inject(HeaderService);

  getEducationListByDeleted(deleted = false): Observable<ApiResponse<Education[]>> {
    return this.header.http.get<ApiResponse<Education[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createEducation(education: Education): Observable<ApiResponse<Education>> {
    const payload = { ...education };
    delete payload.id;
    return this.header.http.post<ApiResponse<Education>>(this.header.url + this.reference, payload);
  }

  updateEducation(educationId: number, education: Education): Observable<ApiResponse<Education>> {
    const payload = { ...education };
    delete payload.id;
    return this.header.http.put<ApiResponse<Education>>(this.header.url + this.reference + `/${educationId}`, payload);
  }

  deleteEducation(educationId: number): Observable<ApiResponse<Education[]>> {
    return this.header.http.delete<ApiResponse<Education[]>>(this.header.url + this.reference + `/${educationId}`);
  }

}
