export interface Institution {
  readonly id: number;
  readonly name: string;
  readonly name_es: string;
  readonly url?: string;
}

export interface InstitutionPayload {
  readonly name: string;
  readonly name_es: string;
}
