import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Skill } from '@shared/models/skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
  standalone: false
})
export class SkillComponent {

  protected readonly translate = inject(TranslateService);

  @Input() skillList: Skill[] = [];

  title = { label: 'Skill', label_es: 'Habilidades' }

}
