export interface Education {
  readonly id: number;
  readonly title: string;
  readonly title_es: string;
  readonly place: string;
  readonly start: string;
  readonly start_es: string;
  readonly end: string;
  readonly end_es: string;
  readonly position: number;
  readonly deleted: boolean;
  readonly institution: number;
  readonly institution_name: string;
  readonly institution_name_es: string;
  readonly institution_url: string;
}

export type EducationPayload = Readonly<
  Pick<
    Education,
    | 'title'
    | 'title_es'
    | 'institution'
    | 'place'
    | 'start'
    | 'start_es'
    | 'end'
    | 'end_es'
    | 'position'
  >
>;
