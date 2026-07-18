export interface Technology {
  id?: number;
  name: string;
}

export type TechnologyPayload = Pick<Technology, 'name'>;
