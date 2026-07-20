import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectLinkType } from '@shared/interfaces/project';
import { ProjectLinkFormArray, ProjectLinkFormGroup } from './project-form.types';

interface LinkTypeOption {
  readonly value: ProjectLinkType;
  readonly label: string;
}

@Component({
  selector: 'app-project-links-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <fieldset class="col-12 border rounded p-3">
      <div class="row mb-3">
        <div class="col-6">
          <legend class="fs-6 fw-bold mb-0">Project links</legend>
        </div>
        <div class="col-6 text-end">
          <button
            (click)="addLink.emit()"
            class="btn btn-sm btn-outline-primary px-4"
            type="button"
          >
            <i class="pi pi-plus" aria-hidden="true"></i>
            Link
          </button>
        </div>
      </div>

      @for (linkGroup of links().controls; track linkGroup) {
        <div class="row g-2 align-items-start mb-2" [formGroup]="linkGroup">
          <div class="col-12 col-md-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type">
                @for (option of linkTypeOptions(); track option.value) {
                  <mat-option [value]="option.value">{{ option.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

          <div class="col-12 col-md-5">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>URL</mat-label>
              <input formControlName="url" type="url" matInput />
              @if (linkGroup.controls.url.touched && linkGroup.controls.url.invalid) {
                <mat-error>Enter a valid HTTPS URL</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="col-8 col-md-2">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Order</mat-label>
              <input formControlName="position" min="1" type="number" matInput />
            </mat-form-field>
          </div>

          <div class="col-4 col-md-2 text-center pt-2">
            <button
              (click)="removeLink.emit(linkGroup)"
              [attr.aria-label]="'Remove link ' + ($index + 1)"
              class="btn btn-outline-danger"
              type="button"
            >
              <i class="pi pi-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      }

      @if (links().touched && links().invalid) {
        <small class="text-danger">
          Links must use valid HTTPS URLs without duplicated types or positions.
        </small>
      }
    </fieldset>
  `,
})
export class ProjectLinksControlComponent {
  readonly links = input.required<ProjectLinkFormArray>();
  readonly linkTypeOptions = input<readonly LinkTypeOption[]>([]);
  readonly addLink = output<void>();
  readonly removeLink = output<ProjectLinkFormGroup>();
}
