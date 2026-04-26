import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService } from 'primeng/api';
import { AppRoutingModule } from '@src/app-routing.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import { BrowserModule } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from '@src/app.component';
import { NgModule } from '@angular/core';
import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ 
    NgxSpinnerModule,
    AppRoutingModule,
    BrowserModule
  ],
  providers: [
    ConfirmationService,
    DialogService,
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
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
