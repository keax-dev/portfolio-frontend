import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { Education } from '@app/home/interfaces/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  standalone: false
})
export class EducationComponent {

  protected readonly translate = inject(TranslateService);

  @Input() educationList: Education[] = [];

  title = { label: 'Education', label_es: 'Educación' }

}
