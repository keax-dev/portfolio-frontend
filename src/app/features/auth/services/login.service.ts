import { LoginCredentials, LoginResponse } from '@features/auth/interfaces/auth';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly reference = '/auth';

  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}${this.reference}/login`,
      credentials,
    );
  }
}
