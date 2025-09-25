import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { providePrimeNG } from 'primeng/config';
import { BrowserModule } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false
        }
      }
    }),
    provideToastr()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
