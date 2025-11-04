import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { ParameterService } from '@app/shared/services/parameter.service';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-project-carousel',
  templateUrl: './project-carousel.component.html',
  styleUrls: ['./project-carousel.component.css'],
  standalone: false
})
export class ProjectCarouselComponent implements OnChanges {

  private parameter = inject(ParameterService);

  @Input() projectList: Project[] = [];
  @Input() technology = 0;

  carouselId!: string;

  ngOnInit(): void {
    this.updateCarouselId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technology']) this.updateCarouselId();
  }

  updateCarouselId() {
    this.carouselId = `carouselProject${this.technology}`;
  }

  showProjectDetails(project: Project) {
    this.parameter.openDialog(ProjectDetailsComponent, project, '30%', '90%');
  }

}
