import { inject, Injectable } from '@angular/core';
import { ImageService } from '@features/admin/services/images.service';
import { ProjectService } from '@features/admin/services/project.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Project, ProjectPayload } from '@shared/interfaces/project';
import { catchError, concatMap, Observable, of, throwError } from 'rxjs';

@Injectable()
export class ProjectPersistenceService {
  private readonly imageService = inject(ImageService);
  private readonly projectService = inject(ProjectService);

  save(
    projectId: number | null,
    payload: ProjectPayload,
    images: readonly File[],
  ): Observable<ApiResponse<Project>> {
    const isUpdate = projectId !== null;
    const saveRequest = isUpdate
      ? this.projectService.updateProject(projectId, payload)
      : this.projectService.createProject(payload);

    return saveRequest.pipe(
      concatMap((response) => {
        if (!images.length) return of(response);

        return this.imageService.uploadProjectImages(response.data.id, images).pipe(
          catchError((uploadError: unknown) => {
            if (isUpdate) return throwError(() => uploadError);
            return this.rollbackCreation(response.data.id, uploadError);
          }),
        );
      }),
    );
  }

  private rollbackCreation(
    projectId: number,
    uploadError: unknown,
  ): Observable<ApiResponse<Project>> {
    return this.projectService.deleteProject(projectId).pipe(
      concatMap(() => throwError(() => uploadError)),
      catchError((rollbackError: unknown) => {
        if (rollbackError === uploadError) return throwError(() => uploadError);
        return throwError(() => rollbackError);
      }),
    );
  }
}
