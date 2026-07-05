import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import {
  VisitorLocationResponse,
  VisitorRegisterPayload,
  VisitorDashboard,
  Visitor,
} from '@features/portfolio/interfaces/visitor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly reference = '/visitor';

  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  registerVisit(path: string): Observable<ApiResponse<Visitor | null>> {
    return this.resolveLocation().pipe(
      switchMap((location) =>
        this.http.post<ApiResponse<Visitor | null>>(this.baseUrl + this.reference, {
          path,
          country: location.country,
          city: location.city,
        }),
      ),
    );
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

  private resolveLocation(): Observable<Partial<VisitorRegisterPayload>> {
    return this.http.get<VisitorLocationResponse>(environment.visitorGeoUrl).pipe(
      map((response) => ({
        country: this.clean(response.location?.country),
        city: this.clean(response.location?.city),
      })),
      catchError(() => of({})),
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
