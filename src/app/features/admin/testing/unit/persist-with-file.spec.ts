import { persistWithOptionalFile } from '@features/admin/persistence/persist-with-file';
import { firstValueFrom, of, throwError } from 'rxjs';

describe('persistWithOptionalFile', () => {
  const entity = { id: 1, name: 'Angular' };
  const metadataResponse = { status: true, alert: 'Saved', data: entity };

  it('returns the metadata entity when no file was selected', async () => {
    const upload = vi.fn();
    const result = await firstValueFrom(
      persistWithOptionalFile(of(metadataResponse), null, upload),
    );

    expect(result).toEqual({
      entity,
      successMessages: ['Saved'],
      fileUploadError: null,
    });
    expect(upload).not.toHaveBeenCalled();
  });

  it('returns the uploaded entity and both success messages', async () => {
    const file = new File(['image'], 'certificate.png', { type: 'image/png' });
    const uploaded = { ...entity, image: 'certificate.png' };
    const upload = vi.fn().mockReturnValue(of({ status: true, alert: 'Uploaded', data: uploaded }));

    const result = await firstValueFrom(
      persistWithOptionalFile(of(metadataResponse), file, upload),
    );

    expect(upload).toHaveBeenCalledWith(entity, file);
    expect(result.entity).toEqual(uploaded);
    expect(result.successMessages).toEqual(['Saved', 'Uploaded']);
  });

  it('preserves saved metadata when the secondary upload fails', async () => {
    const failure = new Error('upload unavailable');
    const upload = vi.fn().mockReturnValue(throwError(() => failure));

    const result = await firstValueFrom(
      persistWithOptionalFile(
        of(metadataResponse),
        new File(['image'], 'certificate.png', { type: 'image/png' }),
        upload,
      ),
    );

    expect(result.entity).toEqual(entity);
    expect(result.fileUploadError).toBe(failure);
  });
});
