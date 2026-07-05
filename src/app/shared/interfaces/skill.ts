export interface Skill {
  id?: number;
  name: string;
  position: number;
  picture?: string;
}

export type SkillPayload = Pick<Skill, 'name' | 'position'>;
