import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { Institution } from '@app/home/interfaces/institution';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  reference = "/image";

  private header = inject(HeaderService);

  uploadImageInstitution(institutionId: number, image: File): Observable<ApiResponse<Institution>> {
    const formData = new FormData();
    formData.append('image', image);
    return this.header.http.post<ApiResponse<Institution>>(this.header.url + this.reference + `/institution/${institutionId}`, formData, this.header.httpOptions);
  }

}
