import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Profile, ProfilePayload } from '@shared/interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  reference = '/profile';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(this.baseUrl + this.reference);
  }

  createProfile(profile: ProfilePayload): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(this.baseUrl + this.reference, profile);
  }

  updateProfile(profile: ProfilePayload): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(this.baseUrl + this.reference, profile);
  }
}
