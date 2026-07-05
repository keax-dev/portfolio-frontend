import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Skill } from '@shared/interfaces/skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguagePipe],
})
export class SkillComponent {
  protected readonly translate = inject(TranslateService);

  readonly skillList = input<readonly Skill[]>([]);

  title = { label: 'Skill', label_es: 'Habilidades' };
}
