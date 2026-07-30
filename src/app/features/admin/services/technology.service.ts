import { Technology, TechnologyPayload } from '@shared/interfaces/technology';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  private readonly resource = new CrudResourceClient<Technology, TechnologyPayload>(
    inject(HttpClient),
    `${environment.url}/technology`,
  );

  getTechnologyList(): Observable<ApiResponse<Technology[]>> {
    return this.resource.list();
  }

  createTechnology(payload: TechnologyPayload): Observable<ApiResponse<Technology>> {
    return this.resource.create(payload);
  }

  updateTechnology(
    technologyId: number,
    payload: TechnologyPayload,
  ): Observable<ApiResponse<Technology>> {
    return this.resource.update(technologyId, payload);
  }

  deleteTechnology(technologyId: number): Observable<ApiResponse<Technology[]>> {
    return this.resource.remove(technologyId);
  }
}
