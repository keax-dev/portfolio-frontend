import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/pages/home/home.component').then(
        (component) => component.HomeComponent,
      ),
    children: [
      { path: '', redirectTo: 'institution', pathMatch: 'full' },
      {
        path: 'visitor-dashboard',
        title: 'Visitor Dashboard',
        data: {
          description: 'Dashboard de visitantes con métricas, países, ciudades y trazas de visita.',
        },
        loadComponent: () =>
          import('@features/visitor/pages/visitor-dashboard.component').then(
            (component) => component.VisitorDashboardComponent,
          ),
      },
      {
        path: 'institution',
        title: 'Institutions',
        data: {
          description: 'Gestión de instituciones y sus imágenes dentro del panel administrativo.',
        },
        loadComponent: () =>
          import('@features/admin/pages/institution/table-institution/table-institution.component').then(
            (component) => component.TableInstitutionComponent,
          ),
      },
      {
        path: 'education',
        title: 'Educations',
        data: {
          description: 'Gestión de registros de educación visibles en el portafolio.',
        },
        loadComponent: () =>
          import('@features/admin/pages/education/table-education/table-education.component').then(
            (component) => component.TableEducationComponent,
          ),
      },
      {
        path: 'skill',
        title: 'Skills',
        data: {
          description: 'Gestión de habilidades, orden y material visual del portafolio.',
        },
        loadComponent: () =>
          import('@features/admin/pages/skill/table-skill/table-skill.component').then(
            (component) => component.TableSkillComponent,
          ),
      },
      {
        path: 'technology',
        title: 'Technologies',
        data: {
          description: 'Gestión de tecnologías y agrupación de proyectos relacionados.',
        },
        loadComponent: () =>
          import('@features/admin/pages/technology/table-technology/table-technology.component').then(
            (component) => component.TableTechnologyComponent,
          ),
      },
      {
        path: 'project',
        title: 'Projects',
        data: {
          description: 'Gestión de proyectos con imágenes, descripciones y despliegues.',
        },
        loadComponent: () =>
          import('@features/admin/pages/project/table-project/table-project.component').then(
            (component) => component.TableProjectComponent,
          ),
      },
      {
        path: 'social-network',
        title: 'Social Networks',
        data: {
          description: 'Gestión de enlaces y visibilidad de redes sociales del portafolio.',
        },
        loadComponent: () =>
          import('@features/admin/pages/social-network/table-social-network/table-social-network.component').then(
            (component) => component.TableSocialNetworkComponent,
          ),
      },
      {
        path: 'profile',
        title: 'Profile',
        data: {
          description: 'Gestión del perfil principal, CV y foto del portafolio.',
        },
        loadComponent: () =>
          import('@features/admin/pages/profile/frm-profile/frm-profile.component').then(
            (component) => component.FrmProfileComponent,
          ),
      },
      { path: '**', redirectTo: 'institution', pathMatch: 'full' },
    ],
  },
];
