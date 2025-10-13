import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocialNetwork } from '@app/home/interfaces/social-network';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnInit {

  @Output() contact = new EventEmitter<number>();

  @Input() socialNetworkList: SocialNetwork[] = [];
  @Input() navItems: MenuItem[] = [];

  year = new Date().getFullYear();

  ngOnInit(): void {
    this.navItems = this.navItems.filter(nav => nav.label !== "Login");
  }

  contactEmit(): void {
    this.contact.emit();
  }

}
