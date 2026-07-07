import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  readonly subtitle = input('');
  readonly eyebrow = input('');
  readonly title = input.required<string>();
}
