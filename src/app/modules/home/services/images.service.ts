import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { Institution } from '@app/home/interfaces/institution';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Skill } from '../interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  reference = "/image";

  private header = inject(HeaderService);

  uploadImageInstitution(institutionId: number, image: File): Observable<ApiResponse<Institution>> {
    return this.header.http.post<ApiResponse<Institution>>(this.header.url + this.reference + `/institution/${institutionId}`, this.formData(image), this.header.httpOptions);
  }

  uploadImageSkill(skillId: number, image: File): Observable<ApiResponse<Skill>> {
    return this.header.http.post<ApiResponse<Skill>>(this.header.url + this.reference + `/skill/${skillId}`, this.formData(image), this.header.httpOptions);
  }

  formData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }

}
