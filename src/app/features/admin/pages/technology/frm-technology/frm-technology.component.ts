import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TechnologyService } from '@features/admin/services/technology.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { finalize } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

interface TechnologyDialogData {
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
    MatInputModule,
  ],
})
export class FrmTechnologyComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly technologyService = inject(TechnologyService);
  private readonly data = inject<TechnologyDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Technology>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly technologyForm = this.fb.group({
    name: ['', Validators.required],
  });

  readonly isSaving = signal(false);
  title = 'New Technology';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
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
        error: (error) => this.alert.httpError(error),
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
        error: (error) => this.alert.httpError(error),
      });
  }

  close(technology?: Technology): void {
    this.ref.close(technology);
  }

  get controls(): typeof this.technologyForm.controls {
    return this.technologyForm.controls;
  }
}
