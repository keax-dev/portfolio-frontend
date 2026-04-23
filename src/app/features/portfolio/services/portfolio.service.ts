import { inject, Injectable } from '@angular/core';
import { SocialNetwork } from '@shared/models/social-network';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Technology } from '@shared/models/technology';
import { Observable } from 'rxjs';
import { Education } from '@shared/models/education';
import { Profile } from '@shared/models/profile';
import { Skill } from '@shared/models/skill';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  reference = "/portfolio";

  private header = inject(HeaderService);

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.header.http.get<ApiResponse<Profile>>(this.header.url + this.reference + `/profile`);
  }

  getEducation(): Observable<ApiResponse<Education[]>> {
    return this.header.http.get<ApiResponse<Education[]>>(this.header.url + this.reference + `/education`);
  }

  getSkill(): Observable<ApiResponse<Skill[]>> {
    return this.header.http.get<ApiResponse<Skill[]>>(this.header.url + this.reference + `/skill`);
  }

  getTechnology(): Observable<ApiResponse<Technology[]>> {
    return this.header.http.get<ApiResponse<Technology[]>>(this.header.url + this.reference + `/technology`);
  }

  getSocialNetwork(): Observable<ApiResponse<SocialNetwork[]>> {
    return this.header.http.get<ApiResponse<SocialNetwork[]>>(this.header.url + this.reference + `/socialNetwork`);
  }

  sendEmail(info: { name: string; email: string; message: string }): Observable<ApiResponse<null>> {
    return this.header.http.post<ApiResponse<null>>(this.header.url + this.reference + `/contact`, info);
  }

}
