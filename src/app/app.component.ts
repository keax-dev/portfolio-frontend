import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NotificationOutletComponent } from '@core/notifications/notification-outlet.component';
import { TranslateService } from '@core/services/translate.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NgxSpinnerModule, NotificationOutletComponent],
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

  readonly title = 'Keax Portfolio';

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.translate.getLang;
    });
  }
}
