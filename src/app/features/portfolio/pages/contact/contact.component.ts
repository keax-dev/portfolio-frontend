import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, DestroyRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { LowerCaseDirective } from '@shared/components/directive/lowerCase.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { TranslateService } from '@core/services/translate.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { DialogRef } from '@angular/cdk/dialog';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    LowerCaseDirective,
    ButtonComponent,
    LanguagePipe,
  ],
})
export class ContactComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly translate = inject(TranslateService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
  });

  labels = {
    title: { label: 'Contact me', label_es: 'Contactame' },
    name: {
      label: 'Name: ',
      label_es: 'Nombre: ',
      required: 'The name is required',
      required_es: 'El nombre es requerido',
    },
    email: {
      label: 'Email: ',
      label_es: 'Email: ',
      required: 'The email is required',
      required_es: 'El email es requerido',
    },
    message: {
      label: 'Message: ',
      label_es: 'Mensaje: ',
      required: 'The message is required',
      required_es: 'El mensaje es requerido',
    },
  };

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.portfolioService
      .sendEmail(this.contactForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(true);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  close(completed?: boolean): void {
    this.ref.close(completed);
  }

  get controls(): typeof this.contactForm.controls {
    return this.contactForm.controls;
  }
}
