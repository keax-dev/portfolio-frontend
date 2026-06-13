import { Component, inject, OnChanges, SimpleChanges, OnInit, input } from '@angular/core';
import { ProjectDetailsComponent } from '@features/portfolio/pages/technology/project-details/project-details.component';
import { ShowImageComponent } from '@features/portfolio/pages/technology/show-image/show-image.component';
import { TranslateService } from '@core/services/translate.service';
import { ParameterService } from '@core/services/parameter.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Project } from '@shared/interfaces/project';

@Component({
  selector: 'app-project-carousel',
  templateUrl: './project-carousel.component.html',
  imports: [LanguagePipe]
})
export class ProjectCarouselComponent implements OnChanges, OnInit {

  protected translate = inject(TranslateService);
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
