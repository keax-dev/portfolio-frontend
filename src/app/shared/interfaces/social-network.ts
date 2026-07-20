export interface SocialNetwork {
  readonly id: number;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly position: number;
  readonly url: string;
}

export interface SocialNetworkPayload {
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly position: number;
  readonly url: string;
}
