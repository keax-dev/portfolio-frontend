export interface Technology {
  readonly id: number;
  readonly name: string;
}

export type TechnologyPayload = Readonly<Pick<Technology, 'name'>>;
