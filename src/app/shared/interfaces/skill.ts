export interface Skill {
  readonly id: number;
  readonly name: string;
  readonly position: number;
  readonly picture?: string;
}

export type SkillPayload = Readonly<Pick<Skill, 'name' | 'position'>>;
