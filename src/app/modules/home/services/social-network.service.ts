import { inject, Injectable } from '@angular/core';
import { SocialNetwork } from '@app/home/interfaces/social-network';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {

  reference = "/socialNetwork";

  private header = inject(HeaderService);

  getSocialNetworkListByDeleted(deleted: boolean = false): Observable<ApiResponse<SocialNetwork[]>> {
    return this.header.http.get<ApiResponse<SocialNetwork[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createSocialNetwork(socialNetwork: SocialNetwork): Observable<ApiResponse<SocialNetwork>> {
    delete socialNetwork.id;
    return this.header.http.post<ApiResponse<SocialNetwork>>(this.header.url + this.reference, socialNetwork, this.header.httpOptions);
  }

  updateSocialNetwork(socialNetworkId: number, socialNetwork: SocialNetwork): Observable<ApiResponse<SocialNetwork>> {
    delete socialNetwork.id;
    return this.header.http.put<ApiResponse<SocialNetwork>>(this.header.url + this.reference + `/${socialNetworkId}`, socialNetwork, this.header.httpOptions);
  }

  deleteSocialNetwork(socialNetworkId: number): Observable<ApiResponse<SocialNetwork[]>> {
    return this.header.http.delete<ApiResponse<SocialNetwork[]>>(this.header.url + this.reference + `/${socialNetworkId}`, this.header.httpOptions);
  }

}
