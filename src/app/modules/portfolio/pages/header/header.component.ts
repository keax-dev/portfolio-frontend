import { Component, Input } from '@angular/core';
import { Profile } from '@app/home/interfaces/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {

  @Input() profile!: Profile;

  aria_label = "View resume of ";

}
