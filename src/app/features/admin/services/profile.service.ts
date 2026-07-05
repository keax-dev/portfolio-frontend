import { Profile, ProfilePayload } from '@shared/interfaces/profile';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  reference = '/profile';

  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

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
