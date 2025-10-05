import { Component, Input } from '@angular/core';
import { Education } from '@app/home/interfaces/education';

@Component({
  selector: 'app-card-education',
  templateUrl: './card-education.component.html',
  styleUrls: ['./card-education.component.css'],
  standalone: false
})
export class CardEducationComponent {

  @Input() education!: Education;
  @Input() position!: boolean;

}
