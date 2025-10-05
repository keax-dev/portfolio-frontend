import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Education } from '@app/home/interfaces/education';
import { Profile } from '@app/home/interfaces/profile';

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

}
