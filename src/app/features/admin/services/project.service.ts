import { Project, ProjectPayload } from '@shared/interfaces/project';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly resource = new CrudResourceClient<Project, ProjectPayload>(
    inject(HttpClient),
    `${environment.url}/project`,
  );

  getProjectList(): Observable<ApiResponse<Project[]>> {
    return this.resource.list();
  }

  createProject(payload: ProjectPayload): Observable<ApiResponse<Project>> {
    return this.resource.create(payload);
  }

  updateProject(projectId: number, payload: ProjectPayload): Observable<ApiResponse<Project>> {
    return this.resource.update(projectId, payload);
  }

  deleteProject(projectId: number): Observable<ApiResponse<Project[]>> {
    return this.resource.remove(projectId);
  }
}
