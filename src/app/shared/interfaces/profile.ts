export interface Profile {
  readonly name: string;
  readonly last_name: string;
  readonly title: string;
  readonly title_es: string;
  readonly cv: string;
  readonly cv_es: string;
  readonly image?: string | null;
}

export type ProfilePayload = Readonly<
  Pick<Profile, 'name' | 'last_name' | 'title' | 'title_es' | 'cv' | 'cv_es'>
>;
