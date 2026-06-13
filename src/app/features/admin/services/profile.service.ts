import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Profile } from '@shared/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  reference = "/profile";

  private header = inject(HeaderService);

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.header.http.get<ApiResponse<Profile>>(this.header.url + this.reference);
  }

  createProfile(profile: Profile): Observable<ApiResponse<Profile>> {
    return this.header.http.post<ApiResponse<Profile>>(this.header.url + this.reference, profile);
  }

  updateProfile(profile: Profile): Observable<ApiResponse<Profile>> {
    return this.header.http.put<ApiResponse<Profile>>(this.header.url + this.reference, profile);
  }

}
