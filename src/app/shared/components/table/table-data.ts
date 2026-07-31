import { Column, ColumnKey } from '@shared/components/interfaces/column';

type ValueReader<T extends object> = (record: T, key: ColumnKey<T>) => unknown;

export function filterTableRecords<T extends object>(
  records: readonly T[],
  columns: readonly Column<T>[],
  searchTerm: string,
  readValue: ValueReader<T>,
): readonly T[] {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase();
  if (!normalizedTerm) {
    return [...records];
  }

  return records.filter((record) =>
    columns.some((column) =>
      String(readValue(record, column.value) ?? '')
        .toLocaleLowerCase()
        .includes(normalizedTerm),
    ),
  );
}

export function sortTableRecords<T extends object>(
  records: readonly T[],
  key: ColumnKey<T> | '',
  direction: 1 | -1,
  readValue: ValueReader<T>,
): readonly T[] {
  if (!key) {
    return records;
  }

  return [...records].sort(
    (left, right) => compareTableValues(readValue(left, key), readValue(right, key)) * direction,
  );
}

export function compareTableValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}
