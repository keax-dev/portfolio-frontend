import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Technology } from '@app/home/interfaces/technology';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css'],
  standalone: false
})
export class TechnologyComponent implements OnChanges {

  @Input() technologyList: Technology[] = [];

  value!: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technologyList']) this.updateValue();
  }

  private updateValue() {
    this.value = this.technologyList.length !== 0 ? this.technologyList[0].id! : 0;
  }

}
