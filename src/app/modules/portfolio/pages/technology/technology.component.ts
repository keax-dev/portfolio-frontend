import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { Technology } from '@app/home/interfaces/technology';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css'],
  standalone: false
})
export class TechnologyComponent implements OnChanges {

  protected readonly translate = inject(TranslateService);

  @Input() technologyList: Technology[] = [];

  value!: number;
  title = { label: 'Portfolio', label_es: 'Portafolio' }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technologyList']) this.updateValue();
  }

  private updateValue() {
    this.value = this.technologyList.length !== 0 ? this.technologyList[0].id! : 0;
  }

}
