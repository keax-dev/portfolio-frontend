import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-project-carousel',
  templateUrl: './project-carousel.component.html',
  styleUrls: ['./project-carousel.component.css'],
  standalone: false
})
export class ProjectCarouselComponent implements OnChanges {

  @Input() projectList: Project[] = [];
  @Input() technology = 0;

  carouselId!: string;

  ngOnInit(): void {
    this.updateCarouselId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technology']) this.updateCarouselId();
  }

  private updateCarouselId() {
    this.carouselId = `carouselProject${this.technology}`;
  }

}
