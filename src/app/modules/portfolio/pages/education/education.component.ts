import { Component, Input, OnInit } from '@angular/core';
import { Education } from '@app/home/interfaces/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  standalone: false
})
export class EducationComponent {

  @Input() educationList: Education[] = [];

}
