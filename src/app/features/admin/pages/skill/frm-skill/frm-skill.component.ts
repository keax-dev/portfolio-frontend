import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { imageFileValidator } from '@core/validators/image-file.validator';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { persistWithOptionalFile } from '@features/admin/persistence/persist-with-file';
import { SkillService } from '@features/admin/services/skill.service';
import { Observable } from 'rxjs';
import { Skill } from '@shared/interfaces/skill';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

interface SkillDialogData {
  readonly positions: number;
  readonly skill?: Skill;
}

@Component({
  selector: 'app-frm-skill',
  templateUrl: './frm-skill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    MatFormFieldModule,
    ButtonComponent,
    MatSelectModule,
    MatInputModule,
  ],
})
export class FrmSkillComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly skillService = inject(SkillService);
  private readonly imageService = inject(ImageService);
  private readonly data = inject<SkillDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Skill>>(MatDialogRef);
  private readonly fb = inject(FormBuilder);

  readonly skillForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    position: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    image: this.fb.control<File | null>(null, [
      imageFileValidator(),
      ...(this.data.skill ? [] : [Validators.required]),
    ]),
  });

  readonly isSaving = signal(false);
  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  readonly isUpdate = Boolean(this.data.skill);
  readonly urlImage = this.data.skill?.picture ?? '';
  readonly title = this.isUpdate ? 'Update Skill' : 'New Skill';

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.data.skill) {
      this.skillForm.patchValue(this.data.skill);
    }
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    persistWithOptionalFile(this.persistMetadata(), this.controls.image.value, (skill, image) =>
      this.imageService.uploadImageSkill(skill.id, image),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          result.successMessages.forEach((message) => this.alert.success(message));
          if (result.fileUploadError) {
            this.alert.httpError(result.fileUploadError);
          }
          this.close(result.entity);
          this.isSaving.set(false);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.alert.httpError(error);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.controls.image.setValue(input.files[0]);
      this.controls.image.markAsTouched();
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

  private persistMetadata(): Observable<ApiResponse<Skill>> {
    return this.data.skill
      ? this.skillService.updateSkill(this.data.skill.id, this.skill)
      : this.skillService.createSkill(this.skill);
  }
}
