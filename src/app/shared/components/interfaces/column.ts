export type ColumnKey<T extends object> = Extract<keyof T, string>;

interface BaseColumn<T extends object> {
  readonly name: string;
  readonly value: ColumnKey<T>;
  readonly format?: (record: T) => string;
}

export interface TextColumn<T extends object> extends BaseColumn<T> {
  readonly kind?: 'text';
}

export interface ImageColumn<T extends object> extends BaseColumn<T> {
  readonly kind: 'image';
  readonly imageAlt?: (record: T) => string;
}

export interface LinkColumn<T extends object> extends BaseColumn<T> {
  readonly kind: 'link';
  readonly href?: (record: T) => string;
  readonly openInNewTab?: boolean;
}

export type Column<T extends object> = TextColumn<T> | ImageColumn<T> | LinkColumn<T>;
