export type ColumnKey<T extends object> = Extract<keyof T, string>;

export interface Column<T extends object> {
  readonly name: string;
  readonly value: ColumnKey<T>;
  readonly image?: boolean;
  readonly imageAlt?: (record: T) => string;
}
