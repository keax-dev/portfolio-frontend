import type { EducationDto } from '@shared/api/generated';

type EducationFields =
  | 'id'
  | 'title'
  | 'title_es'
  | 'place'
  | 'start'
  | 'start_es'
  | 'end'
  | 'end_es'
  | 'position'
  | 'deleted'
  | 'institution'
  | 'institution_name'
  | 'institution_name_es'
  | 'institution_url';

type EducationPayloadFields =
  | 'title'
  | 'title_es'
  | 'institution'
  | 'place'
  | 'start'
  | 'start_es'
  | 'end'
  | 'end_es'
  | 'position';

export type Education = Readonly<Required<Pick<EducationDto, EducationFields>>>;

export type EducationPayload = Readonly<Required<Pick<EducationDto, EducationPayloadFields>>>;
