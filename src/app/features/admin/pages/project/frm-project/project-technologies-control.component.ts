import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Technology } from '@shared/interfaces/technology';
import { ProjectTechnologyFormArray, ProjectTechnologyFormGroup } from './project-form.types';

@Component({
  selector: 'app-project-technologies-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <fieldset class="col-12 border rounded p-3">
      <div class="row mb-3">
        <div class="col-6">
          <legend class="fs-6 fw-bold mb-0">Technologies</legend>
        </div>
        <div class="col-6 text-end">
          <button
            (click)="addTechnology.emit()"
            class="btn btn-sm btn-outline-primary px-4"
            type="button"
          >
            <i class="pi pi-plus" aria-hidden="true"></i>
            Technology
          </button>
        </div>
      </div>

      @for (technologyGroup of technologies().controls; track technologyGroup) {
        <div class="row g-2 align-items-start mb-2" [formGroup]="technologyGroup">
          <div class="col-12 col-md-7">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Technology</mat-label>
              <mat-select formControlName="id">
                <mat-option [value]="0" disabled>Select a technology</mat-option>
                @for (technology of technologyList(); track technology.id) {
                  <mat-option [value]="technology.id">{{ technology.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

          <div class="col-8 col-md-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Order</mat-label>
              <input formControlName="position" min="1" type="number" matInput />
            </mat-form-field>
          </div>

          <div class="col-4 col-md-2 text-center pt-2">
            <button
              (click)="removeTechnology.emit(technologyGroup)"
              [attr.aria-label]="'Remove technology ' + ($index + 1)"
              class="btn btn-outline-danger"
              type="button"
            >
              <i class="pi pi-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      }

      @if (technologies().touched && technologies().invalid) {
        <small class="text-danger">
          Select at least one technology without duplicated technologies or positions.
        </small>
      }
    </fieldset>
  `,
})
export class ProjectTechnologiesControlComponent {
  readonly technologies = input.required<ProjectTechnologyFormArray>();
  readonly technologyList = input<readonly Technology[]>([]);
  readonly addTechnology = output<void>();
  readonly removeTechnology = output<ProjectTechnologyFormGroup>();
}
