import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { LowerCaseDirective } from '@shared/components/directive/lowerCase.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { TranslateService } from '@core/services/translate.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { AlertService } from '@core/services/alert.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { uiText } from '@core/i18n/ui-text';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    LowerCaseDirective,
    MatFormFieldModule,
    ButtonComponent,
    MatInputModule,
    LanguagePipe,
  ],
})
export class ContactComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly translate = inject(TranslateService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, boolean>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
  });

  readonly isSaving = signal(false);

  labels = {
    title: { label: 'Contact me', label_es: 'Contáctame' },
    name: {
      label: 'Name: ',
      label_es: 'Nombre: ',
      required: 'The name is required',
      required_es: 'El nombre es requerido',
    },
    email: {
      label: 'Email: ',
      label_es: 'Correo electrónico: ',
      required: 'The email is required',
      required_es: 'El correo es requerido',
      invalid: 'Enter a valid email',
      invalid_es: 'Ingresa un correo válido',
    },
    message: {
      label: 'Message: ',
      label_es: 'Mensaje: ',
      required: 'The message is required',
      required_es: 'El mensaje es requerido',
    },
  };

  ngOnDestroy(): void {
    this.isSaving.set(false);
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.portfolioService
      .sendEmail(this.contactForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(true);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  close(completed?: boolean): void {
    this.ref.close(completed);
  }

  get controls(): typeof this.contactForm.controls {
    return this.contactForm.controls;
  }

  errorMessage(controlName: keyof typeof this.contactForm.controls): string {
    const control = this.controls[controlName];
    if (controlName === 'email' && control.hasError('email')) {
      return this.translate.getLang === 'es'
        ? this.labels.email.invalid_es
        : this.labels.email.invalid;
    }

    if (controlName === 'name') {
      return this.translate.getLang === 'es'
        ? this.labels.name.required_es
        : this.labels.name.required;
    }

    if (controlName === 'email') {
      return this.translate.getLang === 'es'
        ? this.labels.email.required_es
        : this.labels.email.required;
    }

    return this.translate.getLang === 'es'
      ? this.labels.message.required_es
      : this.labels.message.required;
  }

  sendActionLabel(): string {
    return this.translate.text(uiText.actions.send);
  }

  sendingActionLabel(): string {
    return this.translate.text(uiText.actions.sending);
  }

  cancelActionLabel(): string {
    return this.translate.text(uiText.actions.cancel);
  }
}
