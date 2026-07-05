import { Project, ProjectPayload } from '@shared/interfaces/project';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  reference = '/project';

  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  getProjectListByDeleted(deleted = false): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createProject(payload: ProjectPayload): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(this.baseUrl + this.reference, payload);
  }

  updateProject(projectId: number, payload: ProjectPayload): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(
      `${this.baseUrl}${this.reference}/${projectId}`,
      payload,
    );
  }

  deleteProject(projectId: number): Observable<ApiResponse<Project[]>> {
    return this.http.delete<ApiResponse<Project[]>>(
      `${this.baseUrl}${this.reference}/${projectId}`,
    );
  }
}
