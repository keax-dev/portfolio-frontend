import type { ProfileDto } from '@shared/api/generated';

export type Profile = Readonly<
  Pick<ProfileDto, 'name' | 'last_name' | 'title' | 'title_es' | 'cv' | 'cv_es'> & {
    image?: ProfileDto['image'] | null;
  }
>;

export type ProfilePayload = Readonly<
  Pick<ProfileDto, 'name' | 'last_name' | 'title' | 'title_es' | 'cv' | 'cv_es'>
>;
