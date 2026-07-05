import {
  NonNullableFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Component,
  inject,
  DestroyRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { finalize } from 'rxjs';

interface TechnologyDialogData {
  readonly positions: number;
  readonly technology?: Technology;
}

@Component({
  selector: 'app-frm-technology',
  templateUrl: './frm-technology.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, ButtonComponent],
})
export class FrmTechnologyComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly technologyService = inject(TechnologyService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<TechnologyDialogData>(DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<DialogRef<Technology>>(DialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly technologyForm = this.fb.group({
    name: ['', Validators.required],
    position: [0, [Validators.required, Validators.min(1)]],
  });

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
    this.technologyService
      .createTechnology(this.technologyForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
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
    this.spinner.show();
    this.technologyService
      .updateTechnology(this.data.technology!.id!, this.technologyForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
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
