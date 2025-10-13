import { Component, Input } from '@angular/core';
import { Skill } from '@app/home/interfaces/skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
  standalone: false
})
export class SkillComponent {

  @Input() skillList: Skill[] = [];

}
