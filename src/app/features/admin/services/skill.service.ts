import { Skill, SkillPayload } from '@shared/interfaces/skill';
import { inject, Injectable } from '@angular/core';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly resource = new CrudResourceClient<Skill, SkillPayload>(
    inject(HttpClient),
    `${environment.url}/skill`,
  );

  getSkillList(): Observable<ApiResponse<Skill[]>> {
    return this.resource.list();
  }

  createSkill(payload: SkillPayload): Observable<ApiResponse<Skill>> {
    return this.resource.create(payload);
  }

  updateSkill(skillId: number, payload: SkillPayload): Observable<ApiResponse<Skill>> {
    return this.resource.update(skillId, payload);
  }

  deleteSkill(skillId: number): Observable<ApiResponse<Skill[]>> {
    return this.resource.remove(skillId);
  }
}
