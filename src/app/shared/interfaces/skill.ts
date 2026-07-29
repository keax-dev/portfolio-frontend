import type { SkillDto } from '@shared/api/generated';

export type Skill = Readonly<
  Required<Pick<SkillDto, 'id' | 'name' | 'position'>> & Pick<SkillDto, 'picture'>
>;

export type SkillPayload = Readonly<Required<Pick<SkillDto, 'name' | 'position'>>>;
