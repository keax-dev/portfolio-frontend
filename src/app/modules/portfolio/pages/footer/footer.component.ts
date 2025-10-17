import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SocialNetwork } from '@app/home/interfaces/social-network';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent {

  @Output() contact = new EventEmitter<number>();

  @Input() socialNetworkList: SocialNetwork[] = [];
  @Input() navItems: MenuItem[] = [];

  year = new Date().getFullYear();

  contactEmit(): void {
    this.contact.emit();
  }

}
