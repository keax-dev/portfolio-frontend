import type {
  CreateProjectRequestDto,
  ProjectDto,
  ProjectImageDto,
  ProjectLinkDto,
  ProjectLinkRequestDto,
  ProjectTechnologyDto,
  ProjectTechnologyRequestDto,
} from '@shared/api/generated';

export type ProjectLinkType = ProjectLinkDto['type'];

export type ProjectTechnology = Readonly<
  Required<Pick<ProjectTechnologyDto, 'relation_id' | 'id' | 'name' | 'position'>>
>;

export type ProjectLink = Readonly<
  Required<Pick<ProjectLinkDto, 'id' | 'type' | 'url' | 'position'>>
>;

export type ProjectImage = Readonly<Required<Pick<ProjectImageDto, 'id' | 'url' | 'position'>>>;

export type Project = Readonly<
  Required<
    Pick<ProjectDto, 'id' | 'title' | 'title_es' | 'description' | 'description_es' | 'position'>
  > & {
    images: readonly ProjectImage[];
    technologies: readonly ProjectTechnology[];
    links: readonly ProjectLink[];
  }
>;

export type ProjectTechnologyPayload = Readonly<ProjectTechnologyRequestDto>;

export type ProjectLinkPayload = Readonly<ProjectLinkRequestDto>;

export type ProjectPayload = Readonly<
  Required<Omit<CreateProjectRequestDto, 'technologies' | 'links'>> & {
    technologies: ProjectTechnologyPayload[];
    links: ProjectLinkPayload[];
  }
>;
