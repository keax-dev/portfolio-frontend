export interface SocialNetwork {
  id?: number;
  name: string;
  icon: string;
  color: string;
  position: number;
  url: string;
}

export type SocialNetworkPayload = Omit<SocialNetwork, 'id'>;
