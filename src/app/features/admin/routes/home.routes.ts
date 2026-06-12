import { Routes } from '@angular/router';
import { TableSocialNetworkComponent } from '../pages/social-network/table-social-network/table-social-network.component';
import { TableInstitutionComponent } from '../pages/institution/table-institution/table-institution.component';
import { TableTechnologyComponent } from '../pages/technology/table-technology/table-technology.component';
import { TableEducationComponent } from '../pages/education/table-education/table-education.component';
import { TableProjectComponent } from '../pages/project/table-project/table-project.component';
import { TableSkillComponent } from '../pages/skill/table-skill/table-skill.component';
import { FrmProfileComponent } from '../pages/profile/frm-profile/frm-profile.component';
import { HomeComponent } from '../pages/home/home.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'institution', pathMatch: 'full' },
      { path: 'institution', component: TableInstitutionComponent, title: 'Institutions' },
      { path: 'education', component: TableEducationComponent, title: 'Educations' },
      { path: 'skill', component: TableSkillComponent, title: 'Skills' },
      { path: 'technology', component: TableTechnologyComponent, title: 'Technologies' },
      { path: 'project', component: TableProjectComponent, title: 'Projects' },
      { path: 'social-network', component: TableSocialNetworkComponent, title: 'Social Networks' },
      { path: 'profile', component: FrmProfileComponent, title: 'Profile' },
      { path: '**', redirectTo: 'institution', pathMatch: 'full' }
    ]
  }
];
