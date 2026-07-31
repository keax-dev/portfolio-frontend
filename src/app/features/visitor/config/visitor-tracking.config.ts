import { InjectionToken } from '@angular/core';

export interface VisitorTrackingConfig {
  readonly geoUrl: string;
  readonly excludedIpPrefixes: readonly string[];
}

export const VISITOR_TRACKING_CONFIG = new InjectionToken<VisitorTrackingConfig>(
  'VISITOR_TRACKING_CONFIG',
);
