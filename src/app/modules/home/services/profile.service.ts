import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  reference = "/profile";

  private header = inject(HeaderService);

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.header.http.get<ApiResponse<Profile>>(this.header.url + this.reference, this.header.httpOptions);
  }

  createProfile(profile: Profile): Observable<ApiResponse<Profile>> {
    return this.header.http.post<ApiResponse<Profile>>(this.header.url + this.reference, profile, this.header.httpOptions);
  }

  updateProfile(profile: Profile): Observable<ApiResponse<Profile>> {
    return this.header.http.put<ApiResponse<Profile>>(this.header.url + this.reference, profile, this.header.httpOptions);
  }

}
