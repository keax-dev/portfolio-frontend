import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ShowImageComponent } from '@features/portfolio/pages/technology/show-image/show-image.component';
import { ParameterService } from '@core/services/parameter.service';
import { TranslateService } from '@core/services/translate.service';
import { Project, ProjectImage } from '@shared/interfaces/project';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-project-images',
  templateUrl: './project-images.component.html',
  styleUrl: './project-images.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectImagesComponent {
  protected readonly translate = inject(TranslateService);
  private readonly parameter = inject(ParameterService);

  readonly project = input.required<Project>();
  readonly eager = input(false);
  readonly layout = input<'carousel' | 'stack'>('carousel');

  readonly images = computed<readonly ProjectImage[]>(() => {
    return [...this.project().images].sort((a, b) => a.position - b.position);
  });

  readonly carouselId = computed(
    () => `projectImages${this.project().id ?? this.project().position}`,
  );

  showImage(image: ProjectImage, index: number): void {
    this.parameter.openDialog(
      ShowImageComponent,
      { url: image.url, alt: this.imageLabel(index) },
      '95%',
      '97.5%',
    );
  }

  imageLabel(index: number): string {
    return `${this.translate.text(uiText.portfolio.project.openImage)} ${this.imageDescription(index)}`;
  }

  imageDescription(index: number): string {
    return `${index + 1} ${this.translate.text(uiText.portfolio.project.of)} ${this.images().length}: ${this.projectTitle()}`;
  }

  previousImageLabel(): string {
    return this.translate.text(uiText.portfolio.project.previousImage);
  }

  nextImageLabel(): string {
    return this.translate.text(uiText.portfolio.project.nextImage);
  }

  projectTitle(): string {
    const project = this.project();
    return this.translate.getLang === 'es' ? project.title_es : project.title;
  }
}
