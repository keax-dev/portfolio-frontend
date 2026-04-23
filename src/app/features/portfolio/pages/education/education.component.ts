import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Education } from '@shared/models/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  standalone: false
})
export class EducationComponent {

  protected readonly translate = inject(TranslateService);

  @Input() educationList: Education[] = [];

  title = { label: 'Education', label_es: 'Educación' }

}
