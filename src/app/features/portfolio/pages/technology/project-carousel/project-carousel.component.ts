import { Component, inject, OnChanges, SimpleChanges, OnInit, input } from '@angular/core';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { ShowImageComponent } from '../show-image/show-image.component';
import { ParameterService } from '@core/services/parameter.service';
import { Project } from '@shared/models/project';

@Component({
    selector: 'app-project-carousel',
    templateUrl: './project-carousel.component.html'
})
export class ProjectCarouselComponent implements OnChanges, OnInit {

  private parameter = inject(ParameterService);

  readonly projectList = input<Project[]>([]);
  readonly technology = input(0);

  carouselId!: string;

  ngOnInit(): void {
    this.updateCarouselId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technology']) this.updateCarouselId();
  }

  updateCarouselId(): void {
    this.carouselId = `carouselProject${this.technology()}`;
  }

  showProjectDetails(project: Project): void {
    this.parameter.openDialog(ProjectDetailsComponent, project, '30%', '90%');
  }

  showImage(project: Project): void {
    const info = { url: project.picture, alt: project.title };
    this.parameter.openDialog(ShowImageComponent, info, '95%', '97.5%');
  }

}
