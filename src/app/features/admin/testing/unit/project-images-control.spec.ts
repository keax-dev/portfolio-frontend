import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ProjectImagesControlComponent } from '@features/admin/pages/project/frm-project/project-images-control.component';
import { ProjectImage } from '@shared/interfaces/project';

describe('ProjectImagesControlComponent', () => {
  let fixture: ComponentFixture<ProjectImagesControlComponent>;
  let imagesControl: FormControl<File[]>;
  const existingImages: readonly ProjectImage[] = [
    { id: 1, url: 'one.png', position: 1 },
    { id: 2, url: 'two.png', position: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectImagesControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectImagesControlComponent);
    imagesControl = new FormControl<File[]>([], { nonNullable: true });
    fixture.componentRef.setInput('imagesControl', imagesControl);
    fixture.componentRef.setInput('existingImages', existingImages);
    fixture.componentRef.setInput('update', true);
    fixture.detectChanges();
  });

  it('shows existing images and calculates the remaining upload slots', () => {
    expect(fixture.nativeElement.querySelectorAll('img')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('Add images (1 available)');

    imagesControl = new FormControl<File[]>([new File(['x'], 'new.png', { type: 'image/png' })], {
      nonNullable: true,
    });
    fixture.componentRef.setInput('imagesControl', imagesControl);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('new.png');
    expect(fixture.componentInstance.remainingSlots()).toBe(0);
  });

  it('emits file selection and image removal events', () => {
    const filesSelected = vi.fn();
    const removeImage = vi.fn();
    fixture.componentInstance.filesSelected.subscribe(filesSelected);
    fixture.componentInstance.removeImage.subscribe(removeImage);

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    input.dispatchEvent(new Event('change'));
    const deleteButton = fixture.nativeElement.querySelector(
      'button[aria-label="Delete project image 1"]',
    ) as HTMLButtonElement;
    deleteButton.click();

    expect(filesSelected).toHaveBeenCalledOnce();
    expect(removeImage).toHaveBeenCalledWith(existingImages[0]);
  });

  it('renders validation errors and protects the minimum image count', () => {
    fixture.componentRef.setInput('existingImages', [existingImages[0]]);
    imagesControl.setErrors({ invalidFileType: true, maxFileSize: true, maxImages: true });
    imagesControl.markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Only PNG, JPG, JPEG or WEBP');
    expect(fixture.nativeElement.textContent).toContain('5 MB or smaller');
    expect(fixture.nativeElement.textContent).toContain('at most 3 images');
    expect(
      (
        fixture.nativeElement.querySelector(
          'button[aria-label^="Delete project image"]',
        ) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
