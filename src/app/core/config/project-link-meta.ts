import { LocalizedText, uiText } from '@core/i18n/ui-text';
import { ProjectLinkType } from '@shared/interfaces/project';

export interface ProjectLinkMeta {
  readonly adminLabel: string;
  readonly icon: string;
  readonly label: LocalizedText;
}

export const PROJECT_LINK_META: Readonly<Record<ProjectLinkType, ProjectLinkMeta>> = {
  DEPLOY: {
    adminLabel: 'Deploy',
    icon: 'pi pi-external-link',
    label: uiText.portfolio.project.visitSite,
  },
  GITHUB: {
    adminLabel: 'GitHub',
    icon: 'pi pi-github',
    label: uiText.portfolio.project.sourceCode,
  },
  GITHUB_FRONTEND: {
    adminLabel: 'GitHub Frontend',
    icon: 'pi pi-github',
    label: uiText.portfolio.project.frontendCode,
  },
  GITHUB_BACKEND: {
    adminLabel: 'GitHub Backend',
    icon: 'pi pi-github',
    label: uiText.portfolio.project.backendCode,
  },
};

export const PROJECT_LINK_TYPE_OPTIONS = Object.entries(PROJECT_LINK_META).map(([value, meta]) => ({
  value: value as ProjectLinkType,
  label: meta.adminLabel,
}));
