import type { SocialNetworkDto } from '@shared/api/generated';

type SocialNetworkFields = 'id' | 'name' | 'icon' | 'color' | 'position' | 'url';

export type SocialNetwork = Readonly<Required<Pick<SocialNetworkDto, SocialNetworkFields>>>;

export type SocialNetworkPayload = Readonly<
  Required<Pick<SocialNetworkDto, Exclude<SocialNetworkFields, 'id'>>>
>;
