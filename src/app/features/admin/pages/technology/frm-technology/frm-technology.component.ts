import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { finalize } from 'rxjs';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

interface TechnologyDialogData {
  readonly positions: number;
  readonly technology?: Technology;
}

@Component({
  selector: 'app-frm-technology',
  templateUrl: './frm-technology.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    MatFormFieldModule,
    ButtonComponent,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
})
export class FrmTechnologyComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly technologyService = inject(TechnologyService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<TechnologyDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Technology>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly technologyForm = this.fb.group({
    name: ['', Validators.required],
    position: [0, [Validators.required, Validators.min(1)]],
  });

  readonly isSaving = signal(false);
  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  title = 'New Technology';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.data.technology) {
      this.update = true;
      this.title = 'Update Technology';
      this.technologyForm.patchValue(this.data.technology);
    }
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

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
    this.isSaving.set(true);
    this.technologyService
      .createTechnology(this.technologyForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  updateTechnology(): void {
    this.isSaving.set(true);
    this.technologyService
      .updateTechnology(this.data.technology!.id!, this.technologyForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  close(technology?: Technology): void {
    this.ref.close(technology);
  }

  get controls(): typeof this.technologyForm.controls {
    return this.technologyForm.controls;
  }
}
