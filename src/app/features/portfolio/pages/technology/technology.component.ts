import { Component, inject, OnChanges, SimpleChanges, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Technology } from '@shared/models/technology';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { ProjectCarouselComponent } from './project-carousel/project-carousel.component';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '../../pipe/language.pipe';

@Component({
    selector: 'app-technology',
    templateUrl: './technology.component.html',
    imports: [Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, ProjectCarouselComponent, TitleCasePipe, LanguagePipe]
})
export class TechnologyComponent implements OnChanges {

  protected readonly translate = inject(TranslateService);

  readonly technologyList = input<Technology[]>([]);

  value!: number;
  title = { label: 'Portfolio', label_es: 'Portafolio' }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technologyList']) this.updateValue();
  }

  updateValue() {
    const technologyList = this.technologyList();
    this.value = technologyList.length !== 0 ? technologyList[0].id! : 0;
  }

}
