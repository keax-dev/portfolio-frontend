import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import {
  VisitorDashboard,
  VisitorLocationResponse,
  VisitorRegisterPayload,
  Visitor,
} from '@features/visitor/models/visitor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly reference = '/visitor';
  private readonly excludedIpPrefix = '45.70.58.';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  registerVisit(path: string): Observable<ApiResponse<Visitor | null>> {
    return this.resolveLocation().pipe(
      switchMap((location) => {
        if (this.isExcludedIp(location.ip)) {
          return of({
            status: true,
            alert: 'Visit ignored for owner IP',
            data: null,
          });
        }

        return this.http.post<ApiResponse<Visitor | null>>(
          this.baseUrl + this.reference,
          this.buildRegisterPayload(path, location),
        );
      }),
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

  private resolveLocation(): Observable<Partial<VisitorRegisterPayload>> {
    return this.http.get<VisitorLocationResponse>(environment.visitorGeoUrl).pipe(
      map((response) => ({
        ip: this.clean(response.ip),
        country: this.clean(response.location?.country),
        city: this.clean(response.location?.city),
      })),
      catchError(() => of({})),
    );
  }

  private buildRegisterPayload(
    path: string,
    location: Partial<VisitorRegisterPayload>,
  ): VisitorRegisterPayload {
    return {
      path,
      ...(location.ip ? { ip: location.ip } : {}),
      ...(location.country ? { country: location.country } : {}),
      ...(location.city ? { city: location.city } : {}),
    };
  }

  private isExcludedIp(ip?: string): boolean {
    return ip?.startsWith(this.excludedIpPrefix) ?? false;
  }

  private clean(value?: string): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }
}
