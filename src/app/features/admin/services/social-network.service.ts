import { inject, Injectable } from '@angular/core';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {

  reference = "/socialNetwork";

  private header = inject(HeaderService);

  getSocialNetworkListByDeleted(deleted = false): Observable<ApiResponse<SocialNetwork[]>> {
    return this.header.http.get<ApiResponse<SocialNetwork[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createSocialNetwork(socialNetwork: SocialNetwork): Observable<ApiResponse<SocialNetwork>> {
    const payload = { ...socialNetwork };
    delete payload.id;
    return this.header.http.post<ApiResponse<SocialNetwork>>(this.header.url + this.reference, payload);
  }

  updateSocialNetwork(socialNetworkId: number, socialNetwork: SocialNetwork): Observable<ApiResponse<SocialNetwork>> {
    const payload = { ...socialNetwork };
    delete payload.id;
    return this.header.http.put<ApiResponse<SocialNetwork>>(this.header.url + this.reference + `/${socialNetworkId}`, payload);
  }

  deleteSocialNetwork(socialNetworkId: number): Observable<ApiResponse<SocialNetwork[]>> {
    return this.header.http.delete<ApiResponse<SocialNetwork[]>>(this.header.url + this.reference + `/${socialNetworkId}`);
  }

}
