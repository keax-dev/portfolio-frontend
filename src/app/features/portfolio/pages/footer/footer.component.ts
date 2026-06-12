import { Component, inject, output, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { SocialNetwork } from '@shared/models/social-network';
import { MenuItem } from 'primeng/api';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '../../pipe/language.pipe';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    imports: [TitleCasePipe, LanguagePipe]
})
export class FooterComponent {

  protected readonly translate = inject(TranslateService);

  readonly contact = output<void>();

  readonly socialNetworkList = input<SocialNetwork[]>([]);
  readonly navItems = input<MenuItem[]>([]);

  year = new Date().getFullYear();

  messageSN = { label: 'You can contact me through my social networks.', label_es: 'Puedes contactarme a través de mis redes sociales.' }
  messageCR = { label: 'All rights reserved.', label_es: 'Todos los derechos reservados.' }

  contactEmit(): void {
    this.contact.emit();
  }

}
