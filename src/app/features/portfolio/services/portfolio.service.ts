import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Technology } from '@shared/interfaces/technology';
import { Observable } from 'rxjs';
import { Education } from '@shared/interfaces/education';
import { Profile } from '@shared/interfaces/profile';
import { Skill } from '@shared/interfaces/skill';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  reference = '/portfolio';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.baseUrl}${this.reference}/profile`);
  }

  getEducation(): Observable<ApiResponse<Education[]>> {
    return this.http.get<ApiResponse<Education[]>>(`${this.baseUrl}${this.reference}/education`);
  }

  getSkill(): Observable<ApiResponse<Skill[]>> {
    return this.http.get<ApiResponse<Skill[]>>(`${this.baseUrl}${this.reference}/skill`);
  }

  getTechnology(): Observable<ApiResponse<Technology[]>> {
    return this.http.get<ApiResponse<Technology[]>>(`${this.baseUrl}${this.reference}/technology`);
  }

  getSocialNetwork(): Observable<ApiResponse<SocialNetwork[]>> {
    return this.http.get<ApiResponse<SocialNetwork[]>>(
      `${this.baseUrl}${this.reference}/socialNetwork`,
    );
  }

  sendEmail(info: { name: string; email: string; message: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}${this.reference}/contact`, info);
  }
}
