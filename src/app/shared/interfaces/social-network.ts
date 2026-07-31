export interface SocialNetwork {
  readonly id: number;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly position: number;
  readonly url: string;
}

export type SocialNetworkPayload = Readonly<Omit<SocialNetwork, 'id'>>;
