import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { Education } from '@app/home/interfaces/education';

@Component({
  selector: 'app-card-education',
  templateUrl: './card-education.component.html',
  styleUrls: ['./card-education.component.css'],
  standalone: false
})
export class CardEducationComponent {

  protected readonly translate = inject(TranslateService);

  @Input() education!: Education;
  @Input() position!: boolean;

}
