import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { SkillService } from '@features/admin/services/skill.service';
import { Skill } from '@shared/models/skill';
import { UppercaseDirective } from '../../../../../shared/components/directive/uppercase.directive';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-frm-skill',
    templateUrl: './frm-skill.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, Select, ButtonComponent]
})
export class FrmSkillComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private skillService = inject(SkillService);
  private imageService = inject(ImageService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  skillForm!: FormGroup;

  positionList: number[] = [];
  urlImage!: string;
  title = 'New Skill';

  update!: boolean;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.positionList = Array.from({ length: this.config.data.positions }, (_, i) => i + 1);

    if (this.config.data.skill) {
      const skill: Skill = this.config.data.skill;
      this.update = true;
      this.urlImage = skill.picture || '';
      this.title = 'Update Skill';
      this.buildForm(skill.name, skill.position);
      return;
    }

    this.buildForm();
  }

  buildForm(name = '', position: number | null = null): void {
    const validatorsImg = [this.parameter.imageFileValidator];

    if (!name) validatorsImg.push(Validators.required);

    this.skillForm = this.fb.group({
      name: [name, [Validators.required]],
      position: [position, [Validators.required]],
      image: [null, validatorsImg]
    });
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
    this.skillService.createSkill(this.skill).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.uploadImageInstitution(result.data);
      },
      error: error => this.alert.httpError(error)
    });
  }

  updateSkill(): void {
    this.spinner.show();
    this.skillService.updateSkill(this.config.data.skill.id, this.skill).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        if (this.controls['image'].value) {
          this.uploadImageInstitution(result.data);
          return;
        }

        this.close(result.data);
        this.spinner.hide();
      },
      error: error => this.alert.httpError(error)
    });
  }

  uploadImageInstitution(skill: Skill): void {
    this.imageService.uploadImageSkill(skill.id!, this.controls['image'].value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => {
        this.close(skill);
        this.alert.httpError(error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.skillForm.get('image')?.setValue(input.files[0]);
    }
  }

  close(skill?: Skill): void {
    this.ref.close(skill);
  }

  get controls() {
    return this.skillForm.controls;
  }

  get skill() {
    return { name: this.controls['name'].value, position: this.controls['position'].value };
  }

}
