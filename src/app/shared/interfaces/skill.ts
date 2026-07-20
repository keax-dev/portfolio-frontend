export interface Skill {
  readonly id: number;
  readonly name: string;
  readonly position: number;
  readonly picture?: string;
}

export interface SkillPayload {
  readonly name: string;
  readonly position: number;
}
