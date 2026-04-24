import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@core/services/header.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Skill } from '@shared/models/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  reference = "/skill";

  private header = inject(HeaderService);

  getSkillListByDeleted(deleted = false): Observable<ApiResponse<Skill[]>> {
    return this.header.http.get<ApiResponse<Skill[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`);
  }

  createSkill(skill: Skill): Observable<ApiResponse<Skill>> {
    const payload = { ...skill };
    delete payload.id;
    return this.header.http.post<ApiResponse<Skill>>(this.header.url + this.reference, payload);
  }

  updateSkill(skillId: number, skill: Skill): Observable<ApiResponse<Skill>> {
    const payload = { ...skill };
    delete payload.id;
    return this.header.http.put<ApiResponse<Skill>>(this.header.url + this.reference + `/${skillId}`, payload);
  }

  deleteSkill(skillId: number): Observable<ApiResponse<Skill[]>> {
    return this.header.http.delete<ApiResponse<Skill[]>>(this.header.url + this.reference + `/${skillId}`);
  }

}
