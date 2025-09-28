import { inject, Injectable } from '@angular/core';
import { HeaderService } from '@app/home/services/header.service';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';
import { Observable } from 'rxjs';
import { Skill } from '@app/home/interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  reference = "/skill";

  private header = inject(HeaderService);

  getSkillListByDeleted(deleted: boolean = false): Observable<ApiResponse<Skill[]>> {
    return this.header.http.get<ApiResponse<Skill[]>>(this.header.url + this.reference + `/by-deleted/${deleted}`, this.header.httpOptions);
  }

  createSkill(skill: Skill): Observable<ApiResponse<Skill>> {
    delete skill.id;
    return this.header.http.post<ApiResponse<Skill>>(this.header.url + this.reference, skill, this.header.httpOptions);
  }

  updateSkill(skillId: number, skill: Skill): Observable<ApiResponse<Skill>> {
    delete skill.id;
    return this.header.http.put<ApiResponse<Skill>>(this.header.url + this.reference + `/${skillId}`, skill, this.header.httpOptions);
  }

  deleteSkill(skillId: number): Observable<ApiResponse<Skill[]>> {
    return this.header.http.delete<ApiResponse<Skill[]>>(this.header.url + this.reference + `/${skillId}`, this.header.httpOptions);
  }

}
