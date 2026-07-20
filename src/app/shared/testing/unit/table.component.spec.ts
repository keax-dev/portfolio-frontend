/**
 * Pruebas unitarias del filtrado, ordenamiento, estados visuales, paginación y eventos de la tabla genérica.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from '@shared/components/table/table.component';

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

  // Caso: ordena los registros por la primera columna por defecto.
  it('sorts records by the first column by default', () => {
    expect(renderedColumn(1)).toEqual(['Beta', 'Zulu', 'Alpha']);
  });

  // Caso: filtra filas sin distinguir mayúsculas y reinicia la página.
  it('filters rows case-insensitively and resets the page', () => {
    const search = fixture.nativeElement.querySelector('#table-search') as HTMLInputElement;
    search.value = 'ALP';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(renderedColumn(1)).toEqual(['Alpha']);
  });

  // Caso: ordena una columna de texto seleccionada y alterna su dirección.
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

  // Caso: pagina y cambia el tamaño de página.
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

  // Caso: emite acciones de edición y eliminación con el registro seleccionado.
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

  // Caso: renderiza un estado vacío cuando no hay registros disponibles.
  it('renders an empty state', () => {
    fixture.componentRef.setInput('records', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no records.');
  });

  // Caso: diferencia entre vacío general y vacío por filtro.
  it('renders a dedicated empty state when the search returns no matches', () => {
    const search = fixture.nativeElement.querySelector('#table-search') as HTMLInputElement;
    search.value = 'does-not-exist';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No records match the current search.');
  });

  // Caso: renderiza estados de carga y error dentro de la tabla.
  it('renders loading and error states inside the table', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading records...');

    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('errorMessage', 'Unable to load records');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to load records');
  });

  // Caso: renderiza valores de imagen y un texto alternativo accesible.
  it('renders image values and accessible fallback text', () => {
    fixture.componentRef.setInput('columns', [
      {
        name: 'Picture',
        value: 'picture',
        image: true,
        imageAlt: (record: { name: string }) => record.name,
      },
    ]);
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
