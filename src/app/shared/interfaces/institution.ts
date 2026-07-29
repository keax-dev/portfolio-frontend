import type { InstitutionDto } from '@shared/api/generated';

export type Institution = Readonly<
  Required<Pick<InstitutionDto, 'id' | 'name' | 'name_es'>> & Pick<InstitutionDto, 'url'>
>;

export type InstitutionPayload = Readonly<Pick<InstitutionDto, 'name' | 'name_es'>>;
