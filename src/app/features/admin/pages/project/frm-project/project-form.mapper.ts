import { ProjectLinkType, ProjectPayload } from '@shared/interfaces/project';

export interface ProjectFormValue {
  readonly title: string;
  readonly title_es: string;
  readonly description: string;
  readonly description_es: string;
  readonly position: number;
  readonly technologies: readonly {
    readonly relation_id: number | null;
    readonly id: number;
    readonly position: number;
  }[];
  readonly links: readonly {
    readonly id: number | null;
    readonly type: ProjectLinkType;
    readonly url: string;
    readonly position: number;
  }[];
}

export function toProjectPayload(value: ProjectFormValue): ProjectPayload {
  return {
    title: value.title,
    title_es: value.title_es,
    description: value.description,
    description_es: value.description_es,
    position: value.position,
    technologies: value.technologies.map((technology) => ({
      id: technology.id,
      position: technology.position,
    })),
    links: value.links.map((link) => ({
      type: link.type,
      url: link.url.trim(),
      position: link.position,
    })),
  };
}
