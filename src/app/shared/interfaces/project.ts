export type ProjectLinkType = 'DEPLOY' | 'GITHUB' | 'GITHUB_FRONTEND' | 'GITHUB_BACKEND';

export interface ProjectTechnology {
  readonly relation_id: number;
  readonly id: number;
  readonly name: string;
  readonly position: number;
}

export interface ProjectLink {
  readonly id: number;
  readonly type: ProjectLinkType;
  readonly url: string;
  readonly position: number;
}

export interface ProjectImage {
  readonly id: number;
  readonly url: string;
  readonly position: number;
}

export interface Project {
  readonly id: number;
  readonly title: string;
  readonly title_es: string;
  readonly description: string;
  readonly description_es: string;
  readonly images: readonly ProjectImage[];
  readonly position: number;
  readonly technologies: readonly ProjectTechnology[];
  readonly links: readonly ProjectLink[];
}

export interface ProjectTechnologyPayload {
  readonly relation_id?: number;
  readonly id: number;
  readonly position: number;
}

export interface ProjectLinkPayload {
  readonly id?: number;
  readonly type: ProjectLinkType;
  readonly url: string;
  readonly position: number;
}

export interface ProjectPayload {
  readonly title: string;
  readonly title_es: string;
  readonly description: string;
  readonly description_es: string;
  readonly position: number;
  readonly technologies: readonly ProjectTechnologyPayload[];
  readonly links: readonly ProjectLinkPayload[];
}
