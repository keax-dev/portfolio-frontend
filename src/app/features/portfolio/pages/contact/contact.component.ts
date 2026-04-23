import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { TranslateService } from '@core/services/translate.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: false
})
export class ContactComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.portfolioService.sendEmail(this.contactForm.value).pipe(takeUntil(this.destroy$)).subscribe({
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
