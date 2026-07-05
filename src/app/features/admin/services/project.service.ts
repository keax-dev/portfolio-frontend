import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Project, ProjectPayload } from '@shared/interfaces/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  reference = '/project';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

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
