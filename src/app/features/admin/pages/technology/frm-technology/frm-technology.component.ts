import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-frm-technology',
    templateUrl: './frm-technology.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, Select, ButtonComponent]
})
export class FrmTechnologyComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private technologyService = inject(TechnologyService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  technologyForm!: FormGroup;

  positionList: number[] = [];
  title = 'New Technology';

  update!: boolean;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.technologyForm = this.fb.group({
      name: ['', [Validators.required]],
      position: [null, [Validators.required]]
    });

    this.positionList = Array.from({ length: this.config.data.positions }, (_, i) => i + 1);

    if (this.config.data.technology) {
      this.update = true;
      this.title = 'Update Technology';
      this.technologyForm.patchValue(this.config.data.technology);
    }
  }

  onSubmit(): void {
    if (this.technologyForm.invalid) {
      this.technologyForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateTechnology();
      return;
    }

    this.createTechnology();
  }

  createTechnology(): void {
    this.spinner.show();
    this.technologyService.createTechnology(this.technologyForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  updateTechnology(): void {
    this.spinner.show();
    this.technologyService.updateTechnology(this.config.data.technology.id, this.technologyForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  close(technology?: Technology): void {
    this.ref.close(technology);
  }

  get controls() {
    return this.technologyForm.controls;
  }

}
