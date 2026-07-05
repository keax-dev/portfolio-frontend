import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Component,
  inject,
  DestroyRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { SkillService } from '@features/admin/services/skill.service';
import { Skill } from '@shared/interfaces/skill';
import { finalize } from 'rxjs';

interface SkillDialogData {
  readonly positions: number;
  readonly skill?: Skill;
}

@Component({
  selector: 'app-frm-skill',
  templateUrl: './frm-skill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, ButtonComponent],
})
export class FrmSkillComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly skillService = inject(SkillService);
  private readonly imageService = inject(ImageService);
  private readonly parameter = inject(ParameterService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<SkillDialogData>(DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<DialogRef<Skill>>(DialogRef);
  private readonly fb = inject(FormBuilder);

  readonly skillForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    position: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    image: this.fb.control<File | null>(null, [
      this.parameter.imageFileValidator,
      ...(this.data.skill ? [] : [Validators.required]),
    ]),
  });

  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  urlImage = '';
  title = 'New Skill';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.data.skill) {
      const skill = this.data.skill;
      this.update = true;
      this.urlImage = skill.picture || '';
      this.title = 'Update Skill';
      this.skillForm.patchValue(skill);
    }
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateSkill();
      return;
    }

    this.createSkill();
  }

  createSkill(): void {
    this.spinner.show();
    this.skillService
      .createSkill(this.skill)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  updateSkill(): void {
    this.spinner.show();
    this.skillService
      .updateSkill(this.data.skill!.id!, this.skill)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageInstitution(result.data);
            return;
          }

          this.close(result.data);
          this.spinner.hide();
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  uploadImageInstitution(skill: Skill): void {
    const image = this.controls.image.value;
    if (!image) {
      this.spinner.hide();
      return;
    }

    this.imageService
      .uploadImageSkill(skill.id!, image)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => {
          this.close(skill);
          this.alert.httpError(error, undefined, false);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.controls.image.setValue(input.files[0]);
    }
  }

  close(skill?: Skill): void {
    this.ref.close(skill);
  }

  get controls(): typeof this.skillForm.controls {
    return this.skillForm.controls;
  }

  get skill() {
    const { name, position } = this.skillForm.getRawValue();
    return { name, position };
  }
}
