import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Auth } from '@features/auth/interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  reference = "/auth";

  private header = inject(HeaderService);

  login(auth: Auth): Observable<ApiResponse<Auth>> {
    return this.header.http.post<ApiResponse<Auth>>(this.header.url + this.reference + "/login", auth);
  }

}
