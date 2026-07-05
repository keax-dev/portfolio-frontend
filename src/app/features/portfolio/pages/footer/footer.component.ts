import { Component, inject, output, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, LanguagePipe],
})
export class FooterComponent {
  protected readonly translate = inject(TranslateService);

  readonly contact = output<void>();

  readonly socialNetworkList = input<readonly SocialNetwork[]>([]);
  readonly navItems = input<readonly NavigationItem[]>([]);

  year = new Date().getFullYear();

  messageSN = {
    label: 'You can contact me through my social networks.',
    label_es: 'Puedes contactarme a través de mis redes sociales.',
  };
  messageCR = { label: 'All rights reserved.', label_es: 'Todos los derechos reservados.' };

  contactEmit(): void {
    this.contact.emit();
  }
}
