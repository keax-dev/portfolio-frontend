import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Education } from '@app/home/interfaces/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  reference = "/education";

  private header = inject(HeaderService);

  getEducationListByDeleted(deleted: boolean = false): Observable<ApiResponse<Education[]>> {
    return this.header.http.get<ApiResponse<Education[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createEducation(education: Education): Observable<ApiResponse<Education>> {
    delete education.id;
    return this.header.http.post<ApiResponse<Education>>(this.header.url + this.reference, education, this.header.httpOptions);
  }

  updateEducation(educationId: number, education: Education): Observable<ApiResponse<Education>> {
    delete education.id;
    return this.header.http.put<ApiResponse<Education>>(this.header.url + this.reference + `/${educationId}`, education, this.header.httpOptions);
  }

  deleteEducation(educationId: number): Observable<ApiResponse<Education[]>> {
    return this.header.http.delete<ApiResponse<Education[]>>(this.header.url + this.reference + `/${educationId}`, this.header.httpOptions);
  }

}
