import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TechnologyService } from '@app/home/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '@app/shared/services/alert.service';
import { Technology } from '@app/home/interfaces/technology';

@Component({
  selector: 'app-frm-technology',
  templateUrl: './frm-technology.component.html',
  styleUrls: ['./frm-technology.component.css'],
  standalone: false
})
export class FrmTechnologyComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
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
    this.technologyService.createTechnology(this.technologyForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  updateTechnology(): void {
    this.spinner.show();
    this.technologyService.updateTechnology(this.config.data.technology.id, this.technologyForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  close(technology?: Technology): void {
    this.ref.close(technology);
  }

  get controls() {
    return this.technologyForm.controls;
  }

}
