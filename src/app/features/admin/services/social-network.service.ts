import { SocialNetwork, SocialNetworkPayload } from '@shared/interfaces/social-network';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  private readonly resource = new CrudResourceClient<SocialNetwork, SocialNetworkPayload>(
    inject(HttpClient),
    `${environment.url}/socialNetwork`,
  );

  getSocialNetworkList(): Observable<ApiResponse<SocialNetwork[]>> {
    return this.resource.list();
  }

  createSocialNetwork(payload: SocialNetworkPayload): Observable<ApiResponse<SocialNetwork>> {
    return this.resource.create(payload);
  }

  updateSocialNetwork(
    socialNetworkId: number,
    payload: SocialNetworkPayload,
  ): Observable<ApiResponse<SocialNetwork>> {
    return this.resource.update(socialNetworkId, payload);
  }

  deleteSocialNetwork(socialNetworkId: number): Observable<ApiResponse<SocialNetwork[]>> {
    return this.resource.remove(socialNetworkId);
  }
}
