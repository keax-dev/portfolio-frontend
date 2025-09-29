import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ImageService } from '@app/home/services/images.service';
import { SkillService } from '@app/home/services/skill.service';
import { Skill } from '@app/home/interfaces/skill';

@Component({
  selector: 'app-frm-skill',
  templateUrl: './frm-skill.component.html',
  styleUrls: ['./frm-skill.component.css'],
  standalone: false
})
export class FrmSkillComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
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

  buildForm(name: string = '', position: number | null = null): void {
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
    this.skillService.createSkill(this.skill).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  updateSkill(): void {
    this.spinner.show();
    this.skillService.updateSkill(this.config.data.skill.id, this.skill).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageInstitution(result.data);
          } else {
            this.close(result.data);
            this.spinner.hide();
          }
        } else {
          this.alert.resultWarnings(result);
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  uploadImageInstitution(skill: Skill): void {
    this.imageService.uploadImageSkill(skill.id!, this.controls['image'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.close(skill);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
