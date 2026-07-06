import { SocialNetwork, SocialNetworkPayload } from '@shared/interfaces/social-network';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  reference = '/socialNetwork';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  getSocialNetworkListByDeleted(deleted = false): Observable<ApiResponse<SocialNetwork[]>> {
    return this.http.get<ApiResponse<SocialNetwork[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createSocialNetwork(payload: SocialNetworkPayload): Observable<ApiResponse<SocialNetwork>> {
    return this.http.post<ApiResponse<SocialNetwork>>(this.baseUrl + this.reference, payload);
  }

  updateSocialNetwork(
    socialNetworkId: number,
    payload: SocialNetworkPayload,
  ): Observable<ApiResponse<SocialNetwork>> {
    return this.http.put<ApiResponse<SocialNetwork>>(
      `${this.baseUrl}${this.reference}/${socialNetworkId}`,
      payload,
    );
  }

  deleteSocialNetwork(socialNetworkId: number): Observable<ApiResponse<SocialNetwork[]>> {
    return this.http.delete<ApiResponse<SocialNetwork[]>>(
      `${this.baseUrl}${this.reference}/${socialNetworkId}`,
    );
  }
}
