import type { TechnologyDto } from '@shared/api/generated';

export type Technology = Readonly<Required<Pick<TechnologyDto, 'id' | 'name'>>>;

export type TechnologyPayload = Readonly<Pick<TechnologyDto, 'name'>>;
