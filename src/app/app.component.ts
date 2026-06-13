import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NgxSpinnerModule]
})
export class AppComponent {

  title = 'Keax Portfolio';

}
