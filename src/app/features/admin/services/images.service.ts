import { inject, Injectable } from '@angular/core';
import { Institution } from '@shared/interfaces/institution';
import { environment } from '@src/environments/environment';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '@shared/interfaces/project';
import { Profile } from '@shared/interfaces/profile';
import { Skill } from '@shared/interfaces/skill';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  reference = '/image';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  uploadImageInstitution(institutionId: number, image: File): Observable<ApiResponse<Institution>> {
    return this.http.post<ApiResponse<Institution>>(
      `${this.baseUrl}${this.reference}/institution/${institutionId}`,
      this.formData(image),
    );
  }

  uploadImageSkill(skillId: number, image: File): Observable<ApiResponse<Skill>> {
    return this.http.post<ApiResponse<Skill>>(
      `${this.baseUrl}${this.reference}/skill/${skillId}`,
      this.formData(image),
    );
  }

  uploadImageProject(projectId: number, image: File): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(
      `${this.baseUrl}${this.reference}/project/${projectId}`,
      this.formData(image),
    );
  }

  uploadImageProfile(image: File): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(
      `${this.baseUrl}${this.reference}/profile`,
      this.formData(image),
    );
  }

  formData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }
}
