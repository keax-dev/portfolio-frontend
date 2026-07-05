export interface Profile {
  name: string;
  last_name: string;
  title: string;
  title_es: string;
  cv: string;
  image?: string | null;
}

export type ProfilePayload = Pick<Profile, 'name' | 'last_name' | 'title' | 'title_es' | 'cv'>;
