export interface Institution {
  id?: number;
  name: string;
  name_es: string;
  url?: string;
}

export type InstitutionPayload = Pick<Institution, 'name' | 'name_es'>;
