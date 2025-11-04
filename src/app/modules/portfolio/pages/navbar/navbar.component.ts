import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { MenuItem } from 'primeng/api';
import { Profile } from '@app/home/interfaces/profile';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {

  protected translate = inject(TranslateService);

  @Output() contact = new EventEmitter<number>();

  @Input() navItems: MenuItem[] = [];
  @Input() profile!: Profile;

  languages = [{ code: 'En', language: 'English' }, { code: 'Es', language: 'Español' }];

  ngOnInit(): void {
    console.log(this.profile);
  }

  closeNavbar(): void {
    const navbarBtn = document.getElementById('navbarBtn');
    if (navbarBtn) navbarBtn.click();
  }

  contactEmit(): void {
    this.closeNavbar();
    this.contact.emit();
  }

}
