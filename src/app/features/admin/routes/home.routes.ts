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
        loadComponent: () =>
          import('@features/admin/pages/visitor-dashboard/visitor-dashboard.component').then(
            (component) => component.VisitorDashboardComponent,
          ),
      },
      {
        path: 'institution',
        title: 'Institutions',
        loadComponent: () =>
          import('@features/admin/pages/institution/table-institution/table-institution.component').then(
            (component) => component.TableInstitutionComponent,
          ),
      },
      {
        path: 'education',
        title: 'Educations',
        loadComponent: () =>
          import('@features/admin/pages/education/table-education/table-education.component').then(
            (component) => component.TableEducationComponent,
          ),
      },
      {
        path: 'skill',
        title: 'Skills',
        loadComponent: () =>
          import('@features/admin/pages/skill/table-skill/table-skill.component').then(
            (component) => component.TableSkillComponent,
          ),
      },
      {
        path: 'technology',
        title: 'Technologies',
        loadComponent: () =>
          import('@features/admin/pages/technology/table-technology/table-technology.component').then(
            (component) => component.TableTechnologyComponent,
          ),
      },
      {
        path: 'project',
        title: 'Projects',
        loadComponent: () =>
          import('@features/admin/pages/project/table-project/table-project.component').then(
            (component) => component.TableProjectComponent,
          ),
      },
      {
        path: 'social-network',
        title: 'Social Networks',
        loadComponent: () =>
          import('@features/admin/pages/social-network/table-social-network/table-social-network.component').then(
            (component) => component.TableSocialNetworkComponent,
          ),
      },
      {
        path: 'profile',
        title: 'Profile',
        loadComponent: () =>
          import('@features/admin/pages/profile/frm-profile/frm-profile.component').then(
            (component) => component.FrmProfileComponent,
          ),
      },
      { path: '**', redirectTo: 'institution', pathMatch: 'full' },
    ],
  },
];
