import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Skill, SkillPayload } from '@shared/interfaces/skill';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  reference = '/skill';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getSkillListByDeleted(deleted = false): Observable<ApiResponse<Skill[]>> {
    return this.http.get<ApiResponse<Skill[]>>(
      `${this.baseUrl}${this.reference}/by-deleted/${deleted}`,
    );
  }

  createSkill(payload: SkillPayload): Observable<ApiResponse<Skill>> {
    return this.http.post<ApiResponse<Skill>>(this.baseUrl + this.reference, payload);
  }

  updateSkill(skillId: number, payload: SkillPayload): Observable<ApiResponse<Skill>> {
    return this.http.put<ApiResponse<Skill>>(
      `${this.baseUrl}${this.reference}/${skillId}`,
      payload,
    );
  }

  deleteSkill(skillId: number): Observable<ApiResponse<Skill[]>> {
    return this.http.delete<ApiResponse<Skill[]>>(`${this.baseUrl}${this.reference}/${skillId}`);
  }
}
