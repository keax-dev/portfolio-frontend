import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Auth } from '../interfaces/auth';

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
