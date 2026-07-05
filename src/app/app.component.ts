import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationOutletComponent } from '@core/notifications/notification-outlet.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NgxSpinnerModule, NotificationOutletComponent],
})
export class AppComponent {
  readonly title = 'Keax Portfolio';
}
