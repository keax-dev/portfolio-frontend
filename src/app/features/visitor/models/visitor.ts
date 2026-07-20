export interface Visitor {
  readonly id: number;
  readonly ip: string;
  readonly country?: string | null;
  readonly city?: string | null;
  readonly userAgent?: string | null;
  readonly path?: string | null;
  readonly visitedAt: string;
}

export interface VisitorCountryCount {
  country: string;
  total: number;
}

export interface VisitorCityCount {
  city: string;
  total: number;
}

export interface VisitorDashboard {
  totalVisits: number;
  uniqueVisitors: number;
  visitsLast24Hours: number;
  countries: VisitorCountryCount[];
  cities: VisitorCityCount[];
}
