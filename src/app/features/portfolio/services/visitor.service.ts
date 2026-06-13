import { Visitor, VisitorDashboard, VisitorLocationResponse, VisitorRegisterPayload } from '@features/portfolio/interfaces/visitor';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private readonly reference = '/visitor';

  private readonly header = inject(HeaderService);
  private readonly http = inject(HttpClient);

  registerVisit(path: string): Observable<ApiResponse<Visitor | null>> {
    return this.resolveLocation().pipe(
      switchMap(location => this.header.http.post<ApiResponse<Visitor | null>>(
        this.header.url + this.reference,
        {
          path,
          country: location.country,
          city: location.city
        }
      ))
    );
  }

  getVisitorList(startAt?: string, endAt?: string): Observable<ApiResponse<Visitor[]>> {
    return this.header.http.get<ApiResponse<Visitor[]>>(this.header.url + this.reference, {
      params: this.dateRangeParams(startAt, endAt)
    });
  }

  getDashboard(startAt?: string, endAt?: string): Observable<ApiResponse<VisitorDashboard>> {
    return this.header.http.get<ApiResponse<VisitorDashboard>>(this.header.url + this.reference + '/dashboard', {
      params: this.dateRangeParams(startAt, endAt)
    });
  }

  private resolveLocation(): Observable<Partial<VisitorRegisterPayload>> {
    return this.http.get<VisitorLocationResponse>(environment.visitorGeoUrl).pipe(
      map(response => ({
        country: this.clean(response.location?.country),
        city: this.clean(response.location?.city)
      })),
      catchError(() => of({}))
    );
  }

  private clean(value?: string): string | undefined {
    if (!value?.trim()) {
      return undefined;
    }

    return value.trim();
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
