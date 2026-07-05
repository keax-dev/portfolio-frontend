import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { LoginCredentials, LoginResponse } from '@features/auth/interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly reference = '/auth';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}${this.reference}/login`,
      credentials,
    );
  }
}
