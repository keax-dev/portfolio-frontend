import { Education, EducationPayload } from '@shared/interfaces/education';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private readonly resource = new CrudResourceClient<Education, EducationPayload>(
    inject(HttpClient),
    `${environment.url}/education`,
  );

  getEducationList(): Observable<ApiResponse<Education[]>> {
    return this.resource.list();
  }

  createEducation(payload: EducationPayload): Observable<ApiResponse<Education>> {
    return this.resource.create(payload);
  }

  updateEducation(
    educationId: number,
    payload: EducationPayload,
  ): Observable<ApiResponse<Education>> {
    return this.resource.update(educationId, payload);
  }

  deleteEducation(educationId: number): Observable<ApiResponse<Education[]>> {
    return this.resource.remove(educationId);
  }
}
