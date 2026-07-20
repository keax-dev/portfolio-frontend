import { DestroyRef, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { finalize, Observable, switchMap, tap } from 'rxjs';

export interface IdentifiedRecord {
  readonly id: number;
}

export interface AdminCrudListState<T extends IdentifiedRecord> {
  readonly records: Signal<readonly T[]>;
  readonly isLoading: Signal<boolean>;
  readonly loadErrorMessage: Signal<string>;
  load(): void;
  remove(id: number): void;
}

interface AdminCrudListOptions<T extends IdentifiedRecord> {
  readonly destroyRef: DestroyRef;
  readonly load: () => Observable<ApiResponse<readonly T[]>>;
  readonly remove: (id: number) => Observable<ApiResponse<readonly T[]>>;
  readonly loadErrorMessage: string;
  readonly onError: (error: unknown) => void;
  readonly onRemoved: (message: string) => void;
}

export function createAdminCrudListState<T extends IdentifiedRecord>(
  options: AdminCrudListOptions<T>,
): AdminCrudListState<T> {
  const recordsState = signal<readonly T[]>([]);
  const loadingState = signal(false);
  const errorState = signal('');

  const applyRecords = (response: ApiResponse<readonly T[]>): void => {
    recordsState.set(response.data);
    errorState.set('');
  };

  const load = (): void => {
    loadingState.set(true);
    errorState.set('');
    options
      .load()
      .pipe(
        finalize(() => loadingState.set(false)),
        takeUntilDestroyed(options.destroyRef),
      )
      .subscribe({
        next: applyRecords,
        error: (error) => {
          recordsState.set([]);
          errorState.set(options.loadErrorMessage);
          options.onError(error);
        },
      });
  };

  const remove = (id: number): void => {
    loadingState.set(true);
    options
      .remove(id)
      .pipe(
        tap((response) => options.onRemoved(response.alert)),
        switchMap(() => options.load()),
        finalize(() => loadingState.set(false)),
        takeUntilDestroyed(options.destroyRef),
      )
      .subscribe({
        next: applyRecords,
        error: options.onError,
      });
  };

  return {
    records: recordsState.asReadonly(),
    isLoading: loadingState.asReadonly(),
    loadErrorMessage: errorState.asReadonly(),
    load,
    remove,
  };
}
