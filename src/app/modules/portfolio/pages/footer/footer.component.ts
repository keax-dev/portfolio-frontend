import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { SocialNetwork } from '@app/home/interfaces/social-network';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent {

  protected readonly translate = inject(TranslateService);

  @Output() contact = new EventEmitter<number>();

  @Input() socialNetworkList: SocialNetwork[] = [];
  @Input() navItems: MenuItem[] = [];

  year = new Date().getFullYear();

  messageSN = { label: 'You can contact me through my social networks.', label_es: 'Puedes contactarme a través de mis redes sociales.' }
  messageCR = { label: 'All rights reserved.', label_es: 'Todos los derechos reservados.' }

  contactEmit(): void {
    this.contact.emit();
  }

}
