import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Technology } from '@app/home/interfaces/technology';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  reference = "/technology";

  private header = inject(HeaderService);

  getTechnologyListByDeleted(deleted: boolean = false): Observable<ApiResponse<Technology[]>> {
    return this.header.http.get<ApiResponse<Technology[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createTechnology(technology: Technology): Observable<ApiResponse<Technology>> {
    delete technology.id;
    return this.header.http.post<ApiResponse<Technology>>(this.header.url + this.reference, technology, this.header.httpOptions);
  }

  updateTechnology(technologyId: number, technology: Technology): Observable<ApiResponse<Technology>> {
    delete technology.id;
    return this.header.http.put<ApiResponse<Technology>>(this.header.url + this.reference + `/${technologyId}`, technology, this.header.httpOptions);
  }

  deleteTechnology(technologyId: number): Observable<ApiResponse<Technology[]>> {
    return this.header.http.delete<ApiResponse<Technology[]>>(this.header.url + this.reference + `/${technologyId}`, this.header.httpOptions);
  }

}
