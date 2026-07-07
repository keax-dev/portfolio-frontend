import { Project, ProjectPayload } from '@shared/interfaces/project';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  reference = '/project';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  getProjectList(): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(`${this.baseUrl}${this.reference}`);
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
