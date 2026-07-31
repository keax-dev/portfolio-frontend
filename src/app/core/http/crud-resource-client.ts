import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class CrudResourceClient<TEntity, TPayload> {
  constructor(
    private readonly http: HttpClient,
    private readonly resourceUrl: string,
  ) {}

  list(): Observable<ApiResponse<TEntity[]>> {
    return this.http.get<ApiResponse<TEntity[]>>(this.resourceUrl);
  }

  create(payload: TPayload): Observable<ApiResponse<TEntity>> {
    return this.http.post<ApiResponse<TEntity>>(this.resourceUrl, payload);
  }

  update(id: number, payload: TPayload): Observable<ApiResponse<TEntity>> {
    return this.http.put<ApiResponse<TEntity>>(`${this.resourceUrl}/${id}`, payload);
  }

  remove(id: number): Observable<ApiResponse<TEntity[]>> {
    return this.http.delete<ApiResponse<TEntity[]>>(`${this.resourceUrl}/${id}`);
  }
}
