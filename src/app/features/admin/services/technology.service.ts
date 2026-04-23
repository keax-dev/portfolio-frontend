import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Technology } from '@shared/models/technology';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  reference = "/technology";

  private header = inject(HeaderService);

  getTechnologyListByDeleted(deleted: boolean = false): Observable<ApiResponse<Technology[]>> {
    return this.header.http.get<ApiResponse<Technology[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createTechnology(technology: Technology): Observable<ApiResponse<Technology>> {
    const { id: _id, ...payload } = technology;
    return this.header.http.post<ApiResponse<Technology>>(this.header.url + this.reference, payload);
  }

  updateTechnology(technologyId: number, technology: Technology): Observable<ApiResponse<Technology>> {
    const { id: _id, ...payload } = technology;
    return this.header.http.put<ApiResponse<Technology>>(this.header.url + this.reference + `/${technologyId}`, payload);
  }

  deleteTechnology(technologyId: number): Observable<ApiResponse<Technology[]>> {
    return this.header.http.delete<ApiResponse<Technology[]>>(this.header.url + this.reference + `/${technologyId}`);
  }

}
