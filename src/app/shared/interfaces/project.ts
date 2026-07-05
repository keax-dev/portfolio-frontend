export interface Project {
  id?: number;
  title: string;
  title_es: string;
  description: string;
  description_es: string;
  picture?: string;
  deploy?: string;
  github?: string;
  position: number;
  technology: number;
  technology_name?: string;
}

export type ProjectPayload = Pick<
  Project,
  | 'title'
  | 'title_es'
  | 'description'
  | 'description_es'
  | 'deploy'
  | 'github'
  | 'position'
  | 'technology'
>;
