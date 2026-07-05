/**
 * Pruebas unitarias del filtrado, ordenamiento, paginación y eventos de la tabla genérica.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

interface Row {
  name: string;
  position: number;
  picture?: string;
}

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableComponent<Row>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TableComponent<Row>);
    fixture.componentRef.setInput('columns', [
      { name: 'Position', value: 'position' },
      { name: 'Name', value: 'name' },
    ]);
    fixture.componentRef.setInput('records', [
      { name: 'Zulu', position: 2 },
      { name: 'Alpha', position: 10 },
      { name: 'Beta', position: 1 },
    ]);
    fixture.detectChanges();
  });

  // Caso: sorts records by the first column by default.
  it('sorts records by the first column by default', () => {
    expect(renderedColumn(1)).toEqual(['Beta', 'Zulu', 'Alpha']);
  });

  // Caso: filters rows case-insensitively and resets the page.
  it('filters rows case-insensitively and resets the page', () => {
    const search = fixture.nativeElement.querySelector('#table-search') as HTMLInputElement;
    search.value = 'ALP';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(renderedColumn(1)).toEqual(['Alpha']);
  });

  // Caso: sorts a selected text column and toggles its direction.
  it('sorts a selected text column and toggles its direction', () => {
    const nameHeader = fixture.nativeElement.querySelectorAll(
      'thead button',
    )[1] as HTMLButtonElement;
    nameHeader.click();
    fixture.detectChanges();
    expect(renderedColumn(1)).toEqual(['Alpha', 'Beta', 'Zulu']);

    nameHeader.click();
    fixture.detectChanges();
    expect(renderedColumn(1)).toEqual(['Zulu', 'Beta', 'Alpha']);
  });

  // Caso: paginates and changes page size.
  it('paginates and changes page size', () => {
    fixture.componentRef.setInput(
      'records',
      Array.from({ length: 12 }, (_, index) => ({
        name: `Row ${index + 1}`,
        position: index + 1,
      })),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(10);

    const next = Array.from(
      fixture.nativeElement.querySelectorAll('footer button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Next')!;
    next.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 2');
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '5';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Page 1 of 3');
  });

  // Caso: emits edit and delete actions with the selected record.
  it('emits edit and delete actions with the selected record', () => {
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.itemEdit.subscribe(edit);
    fixture.componentInstance.itemDelete.subscribe(remove);

    (
      fixture.nativeElement.querySelector('[aria-label="Edit record"]') as HTMLButtonElement
    ).click();
    (
      fixture.nativeElement.querySelector('[aria-label="Delete record"]') as HTMLButtonElement
    ).click();

    expect(edit).toHaveBeenCalledWith({ name: 'Beta', position: 1 });
    expect(remove).toHaveBeenCalledWith({ name: 'Beta', position: 1 });
  });

  // Caso: renders an empty state.
  it('renders an empty state', () => {
    fixture.componentRef.setInput('records', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no records.');
  });

  // Caso: renders image values and accessible fallback text.
  it('renders image values and accessible fallback text', () => {
    fixture.componentRef.setInput('columns', [{ name: 'Picture', value: 'picture', image: true }]);
    fixture.componentRef.setInput('records', [
      { name: 'Angular', position: 1, picture: 'angular.png' },
      { name: 'No image', position: 2 },
    ]);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toContain('angular.png');
    expect(image.alt).toBe('Angular');
    expect(fixture.nativeElement.textContent).toContain('No image');
  });

  function renderedColumn(index: number): string[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll(
        `tbody td:nth-child(${index + 1})`,
      ) as NodeListOf<HTMLElement>,
    ).map((cell) => cell.textContent?.trim() ?? '');
  }
});
