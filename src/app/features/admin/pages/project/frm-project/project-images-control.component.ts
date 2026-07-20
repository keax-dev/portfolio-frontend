import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectImage } from '@shared/interfaces/project';
import { PROJECT_IMAGE_LIMITS } from './project-form.validators';

@Component({
  selector: 'app-project-images-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <fieldset class="col-12 border rounded p-3">
      <legend class="fs-6 fw-bold">Project images</legend>
      <p class="text-secondary mb-3">
        Every project must have between {{ limits.min }} and {{ limits.max }} images. New images
        keep their selected order.
      </p>

      <label for="images" class="form-label fw-semibold">
        {{ update() ? 'Add images' : 'Select images' }} ({{ remainingSlots() }} available)
      </label>
      <input
        (change)="filesSelected.emit($event)"
        [disabled]="existingImages().length === limits.max"
        accept="image/png,image/jpeg,image/gif"
        class="form-control"
        type="file"
        id="images"
        multiple
      />
      @if (imagesControl().touched && imagesControl().errors?.['required']) {
        <small class="text-danger appear">At least one image is required</small>
      }
      @if (imagesControl().touched && imagesControl().errors?.['invalidFileType']) {
        <small class="text-danger appear">Only image files (png, jpg, jpeg, gif) are allowed</small>
      }
      @if (imagesControl().touched && imagesControl().errors?.['maxFileSize']) {
        <small class="text-danger appear">Each image must be 5 MB or smaller</small>
      }
      @if (imagesControl().touched && imagesControl().errors?.['maxImages']) {
        <small class="text-danger appear">A project can have at most {{ limits.max }} images</small>
      }

      @if (imagesControl().value.length) {
        <ul class="mt-3 mb-0 ps-3">
          @for (image of imagesControl().value; track image.name + image.lastModified) {
            <li>{{ $index + 1 }}. {{ image.name }}</li>
          }
        </ul>
      }

      @if (existingImages().length) {
        <div class="row g-3 mt-1">
          @for (image of existingImages(); track image.id) {
            <div class="col-12 col-sm-6 col-lg-4">
              <div class="border rounded p-2 h-100 text-center">
                <img
                  [src]="image.url"
                  [alt]="'Project image ' + ($index + 1)"
                  class="img-fluid rounded mb-2"
                  loading="lazy"
                />
                <button
                  (click)="removeImage.emit(image)"
                  [attr.aria-label]="'Delete project image ' + ($index + 1)"
                  [disabled]="existingImages().length <= limits.min || isSaving()"
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                >
                  <i class="pi pi-trash" aria-hidden="true"></i>
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }
    </fieldset>
  `,
})
export class ProjectImagesControlComponent {
  readonly imagesControl = input.required<FormControl<File[]>>();
  readonly existingImages = input<readonly ProjectImage[]>([]);
  readonly isSaving = input(false);
  readonly update = input(false);

  readonly filesSelected = output<Event>();
  readonly removeImage = output<ProjectImage>();

  readonly limits = PROJECT_IMAGE_LIMITS;
  readonly remainingSlots = computed(() =>
    Math.max(0, this.limits.max - this.existingImages().length - this.imagesControl().value.length),
  );
}
