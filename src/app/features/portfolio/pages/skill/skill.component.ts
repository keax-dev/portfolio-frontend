import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Skill } from '@shared/models/skill';
import { LanguagePipe } from '../../pipe/language.pipe';

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.css'],
    imports: [LanguagePipe]
})
export class SkillComponent {

  protected readonly translate = inject(TranslateService);

  readonly skillList = input<Skill[]>([]);

  title = { label: 'Skill', label_es: 'Habilidades' }

}
