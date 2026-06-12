import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { TranslateService } from '@core/services/translate.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '@core/services/alert.service';
import { UppercaseDirective } from '../../../../shared/components/directive/uppercase.directive';
import { LowerCaseDirective } from '../../../../shared/components/directive/lowerCase.directive';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LanguagePipe } from '../../pipe/language.pipe';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, LowerCaseDirective, ButtonComponent, LanguagePipe]
})
export class ContactComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  protected readonly translate = inject(TranslateService);
  private portfolioService = inject(PortfolioService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;

  labels = {
    title: { label: 'Contact me', label_es: 'Contactame' },
    name: { label: 'Name: ', label_es: 'Nombre: ', required: 'The name is required', required_es: 'El nombre es requerido' },
    email: { label: 'Email: ', label_es: 'Email: ', required: 'The email is required', required_es: 'El email es requerido' },
    message: { label: 'Message: ', label_es: 'Mensaje: ', required: 'The message is required', required_es: 'El mensaje es requerido' }
  };

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.portfolioService.sendEmail(this.contactForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(true);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  close(completed?: boolean): void {
    this.ref.close(completed);
  }

  get controls() {
    return this.contactForm.controls;
  }

}
