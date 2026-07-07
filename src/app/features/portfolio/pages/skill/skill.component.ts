import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Skill } from '@shared/interfaces/skill';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillComponent {
  protected readonly translate = inject(TranslateService);

  readonly text = uiText;
  readonly skillList = input<readonly Skill[]>([]);

  titleLabel(): string {
    return this.translate.text(this.text.portfolio.sections.skills);
  }

  emptyMessage(): string {
    return this.translate.text(this.text.portfolio.emptyRecords);
  }
}
