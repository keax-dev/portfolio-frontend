import { catchError, concatMap, map, Observable, of } from 'rxjs';
import { ApiResponse } from '@core/interfaces/apiresponse';

export interface FilePersistenceResult<TEntity> {
  readonly entity: TEntity;
  readonly successMessages: readonly string[];
  readonly fileUploadError: unknown | null;
}

export function persistWithOptionalFile<TEntity>(
  metadataRequest: Observable<ApiResponse<TEntity>>,
  file: File | null,
  uploadFile: (entity: TEntity, file: File) => Observable<ApiResponse<TEntity>>,
): Observable<FilePersistenceResult<TEntity>> {
  return metadataRequest.pipe(
    concatMap((metadataResponse) => {
      const metadataResult: FilePersistenceResult<TEntity> = {
        entity: metadataResponse.data,
        successMessages: compactMessages(metadataResponse.alert),
        fileUploadError: null,
      };

      if (!file) {
        return of(metadataResult);
      }

      return uploadFile(metadataResponse.data, file).pipe(
        map((uploadResponse) => ({
          entity: uploadResponse.data,
          successMessages: compactMessages(metadataResponse.alert, uploadResponse.alert),
          fileUploadError: null,
        })),
        catchError((fileUploadError: unknown) =>
          of({
            ...metadataResult,
            fileUploadError,
          }),
        ),
      );
    }),
  );
}

function compactMessages(...messages: readonly string[]): readonly string[] {
  return messages.filter(Boolean);
}
