import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Profile } from '@shared/models/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {

  protected readonly translate = inject(TranslateService);

  @Input() profile!: Profile;

  cv = { label: 'View CV', label_es: 'Visualizar CV' }

  get classTitle() {
    switch (this.translate.getLang) {
      case 'en':
        return 'machine-2';
      case 'es':
        return 'machine-2-es';
      default:
        return '';
    }
  }

}
