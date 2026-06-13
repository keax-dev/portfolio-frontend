import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { Institution } from '@shared/interfaces/institution';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Project } from '@shared/interfaces/project';
import { Profile } from '@shared/interfaces/profile';
import { Skill } from '@shared/interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  reference = "/image";

  private header = inject(HeaderService);

  uploadImageInstitution(institutionId: number, image: File): Observable<ApiResponse<Institution>> {
    return this.header.http.post<ApiResponse<Institution>>(this.header.url + this.reference + `/institution/${institutionId}`, this.formData(image));
  }

  uploadImageSkill(skillId: number, image: File): Observable<ApiResponse<Skill>> {
    return this.header.http.post<ApiResponse<Skill>>(this.header.url + this.reference + `/skill/${skillId}`, this.formData(image));
  }

  uploadImageProject(projectId: number, image: File): Observable<ApiResponse<Project>> {
    return this.header.http.post<ApiResponse<Project>>(this.header.url + this.reference + `/project/${projectId}`, this.formData(image));
  }

  uploadImageProfile(image: File): Observable<ApiResponse<Profile>> {
    return this.header.http.post<ApiResponse<Profile>>(this.header.url + this.reference + `/profile`, this.formData(image));
  }

  formData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }

}
