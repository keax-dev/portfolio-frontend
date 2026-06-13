
export interface Visitor {
  id?: number;
  ip: string;
  country?: string | null;
  city?: string | null;
  userAgent?: string | null;
  path?: string | null;
  visitedAt: string;
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

export interface VisitorLocationResponse {
  ip?: string;
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface VisitorRegisterPayload {
  path: string;
  country?: string;
  city?: string;
}
