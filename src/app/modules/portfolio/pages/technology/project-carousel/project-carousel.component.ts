import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { ShowImageComponent } from '../show-image/show-image.component';
import { ParameterService } from '@app/shared/services/parameter.service';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-project-carousel',
  templateUrl: './project-carousel.component.html',
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

  updateCarouselId(): void {
    this.carouselId = `carouselProject${this.technology}`;
  }

  showProjectDetails(project: Project): void {
    this.parameter.openDialog(ProjectDetailsComponent, project, '30%', '90%');
  }

  showImage(project: Project): void {
    const info = { url: project.picture, alt: project.title };
    this.parameter.openDialog(ShowImageComponent, info, '95%', '97.5%');
  }

}
