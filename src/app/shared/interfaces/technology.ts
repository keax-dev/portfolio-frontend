export interface Technology {
  id?: number;
  name: string;
  position: number;
}

export type TechnologyPayload = Pick<Technology, 'name' | 'position'>;
