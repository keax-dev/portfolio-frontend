import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Project } from '@app/home/interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  reference = "/project";

  private header = inject(HeaderService);

  getProjectListByDeleted(deleted: boolean = false): Observable<ApiResponse<Project[]>> {
    return this.header.http.get<ApiResponse<Project[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createProject(project: Project): Observable<ApiResponse<Project>> {
    delete project.id;
    return this.header.http.post<ApiResponse<Project>>(this.header.url + this.reference, project, this.header.httpOptions);
  }

  updateProject(projectId: number, project: Project): Observable<ApiResponse<Project>> {
    delete project.id;
    return this.header.http.put<ApiResponse<Project>>(this.header.url + this.reference + `/${projectId}`, project, this.header.httpOptions);
  }

  deleteProject(projectId: number): Observable<ApiResponse<Project[]>> {
    return this.header.http.delete<ApiResponse<Project[]>>(this.header.url + this.reference + `/${projectId}`, this.header.httpOptions);
  }

}
