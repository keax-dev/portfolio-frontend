import { LoginCredentials, LoginResponse } from '@features/auth/interfaces/auth';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly reference = '/auth';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}${this.reference}/login`,
      credentials,
    );
  }
}
