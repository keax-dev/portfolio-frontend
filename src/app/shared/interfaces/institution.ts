export interface Institution {
  readonly id: number;
  readonly name: string;
  readonly name_es: string;
  readonly url?: string;
}

export type InstitutionPayload = Readonly<Pick<Institution, 'name' | 'name_es'>>;
