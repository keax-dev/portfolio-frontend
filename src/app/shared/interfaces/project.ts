export type ProjectLinkType = 'DEPLOY' | 'GITHUB' | 'GITHUB_FRONTEND' | 'GITHUB_BACKEND';

export interface ProjectTechnology {
  relation_id?: number;
  id: number;
  name?: string;
  position: number;
}

export interface ProjectLink {
  id?: number;
  type: ProjectLinkType;
  url: string;
  position: number;
}

export interface Project {
  id?: number;
  title: string;
  title_es: string;
  description: string;
  description_es: string;
  picture?: string;
  position: number;
  technologies: ProjectTechnology[];
  links: ProjectLink[];
}

export type ProjectPayload = Pick<
  Project,
  'title' | 'title_es' | 'description' | 'description_es' | 'position' | 'technologies' | 'links'
>;
