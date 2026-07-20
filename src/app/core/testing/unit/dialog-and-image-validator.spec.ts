import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { imageFileValidator } from '@core/validators/image-file.validator';

describe('DialogService and image validation', () => {
  let dialogs: DialogService;
  let breakpoint: { isMatched: ReturnType<typeof vi.fn> };
  let materialDialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    breakpoint = { isMatched: vi.fn().mockReturnValue(false) };
    materialDialog = { open: vi.fn().mockReturnValue({}) };
    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: BreakpointObserver, useValue: breakpoint },
        { provide: MatDialog, useValue: materialDialog },
      ],
    });
    dialogs = TestBed.inject(DialogService);
  });

  it.each(['image/png', 'image/jpeg', 'image/gif'])('accepts %s images', (type) => {
    expect(
      imageFileValidator()(new FormControl(new File(['image'], 'image', { type }))),
    ).toBeNull();
  });

  it('rejects unsupported and oversized files', () => {
    expect(
      imageFileValidator()(new FormControl(new File(['text'], 'file.txt', { type: 'text/plain' }))),
    ).toEqual({ invalidFileType: true });
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    });
    expect(imageFileValidator()(new FormControl(oversized))).toEqual({ maxFileSize: true });
  });

  it('ignores empty and non-file values', () => {
    expect(imageFileValidator()(new FormControl(null))).toBeNull();
    expect(imageFileValidator()(new FormControl('image.png'))).toBeNull();
  });

  it('opens a dialog with responsive widths', () => {
    class DialogContent {}
    const data = { id: 1 };
    dialogs.open(DialogContent, { data });
    expect(materialDialog.open).toHaveBeenLastCalledWith(
      DialogContent,
      expect.objectContaining({ data, width: '45%', maxWidth: '95vw' }),
    );

    breakpoint.isMatched.mockReturnValue(true);
    dialogs.open(DialogContent, { data, desktopWidth: '40%', mobileWidth: '90%' });
    expect(materialDialog.open).toHaveBeenLastCalledWith(
      DialogContent,
      expect.objectContaining({ width: '90%', maxHeight: '95vh', height: 'auto' }),
    );
  });
});
