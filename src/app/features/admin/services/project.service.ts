import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Project } from '@shared/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  reference = "/project";

  private header = inject(HeaderService);

  getProjectListByDeleted(deleted: boolean = false): Observable<ApiResponse<Project[]>> {
    return this.header.http.get<ApiResponse<Project[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createProject(project: Project): Observable<ApiResponse<Project>> {
    const { id: _id, ...payload } = project;
    return this.header.http.post<ApiResponse<Project>>(this.header.url + this.reference, payload);
  }

  updateProject(projectId: number, project: Project): Observable<ApiResponse<Project>> {
    const { id: _id, ...payload } = project;
    return this.header.http.put<ApiResponse<Project>>(this.header.url + this.reference + `/${projectId}`, payload);
  }

  deleteProject(projectId: number): Observable<ApiResponse<Project[]>> {
    return this.header.http.delete<ApiResponse<Project[]>>(this.header.url + this.reference + `/${projectId}`);
  }

}
