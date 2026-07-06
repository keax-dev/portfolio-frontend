import { Skill, SkillPayload } from '@shared/interfaces/skill';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  reference = '/skill';

  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

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
