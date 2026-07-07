export const ADMIN_TABLE_LOAD_ERROR_MESSAGE = 'We could not load the records. Please try again.';

export const adminTableCopy = {
  education: {
    entity: 'Education',
    title: 'Educations',
    subtitle: 'Create, update and delete the education records shown in the public portfolio.',
  },
  institution: {
    entity: 'Institution',
    title: 'Institutions',
    subtitle: 'Manage the institutions used by education and other portfolio sections.',
  },
  project: {
    entity: 'Project',
    title: 'Projects',
    subtitle: 'Keep the portfolio projects updated with titles, images and published links.',
  },
  skill: {
    entity: 'Skill',
    title: 'Skills',
    subtitle: 'Maintain the skills displayed in the portfolio and their visual ordering.',
  },
  socialNetwork: {
    entity: 'Social Network',
    title: 'Social Networks',
    subtitle: 'Configure the public social network links, icons and destination URLs.',
  },
  technology: {
    entity: 'Technology',
    title: 'Technologies',
    subtitle: 'Organize the technologies that group and present the project catalog.',
  },
} as const;
