import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { VisitorDashboard, Visitor } from '@features/visitor/models/visitor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly reference = '/visitor';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  registerVisit(path: string): Observable<ApiResponse<Visitor | null>> {
    return this.http.post<ApiResponse<Visitor | null>>(this.baseUrl + this.reference, { path });
  }

  getVisitorList(startAt?: string, endAt?: string): Observable<ApiResponse<Visitor[]>> {
    return this.http.get<ApiResponse<Visitor[]>>(this.baseUrl + this.reference, {
      params: this.dateRangeParams(startAt, endAt),
    });
  }

  getDashboard(startAt?: string, endAt?: string): Observable<ApiResponse<VisitorDashboard>> {
    return this.http.get<ApiResponse<VisitorDashboard>>(
      this.baseUrl + this.reference + '/dashboard',
      {
        params: this.dateRangeParams(startAt, endAt),
      },
    );
  }

  private dateRangeParams(startAt?: string, endAt?: string): HttpParams {
    let params = new HttpParams();

    if (startAt) {
      params = params.set('startAt', startAt);
    }

    if (endAt) {
      params = params.set('endAt', endAt);
    }

    return params;
  }
}
