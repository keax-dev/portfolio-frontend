export interface Education {
  id?: number;
  title: string;
  title_es: string;
  place: string;
  place_es: string;
  start: string;
  start_es: string;
  end: string;
  end_es: string;
  position: number;
  deleted: boolean;
  institution: number;
  institution_name: string;
  institution_name_es: string;
  institution_url: string;
}

export type EducationPayload = Pick<
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
>;
