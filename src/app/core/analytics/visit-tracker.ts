import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface VisitTracker {
  track(path: string): Observable<void>;
}

export const VISIT_TRACKER = new InjectionToken<VisitTracker>('VISIT_TRACKER');
