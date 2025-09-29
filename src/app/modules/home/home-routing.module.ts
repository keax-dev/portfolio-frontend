import { TableSocialNetworkComponent } from './pages/social-network/table-social-network/table-social-network.component';
import { TableInstitutionComponent } from '@app/home/pages/institution/table-institution/table-institution.component';
import { TableTechnologyComponent } from '@app/home/pages/technology/table-technology/table-technology.component';
import { TableEducationComponent } from '@app/home/pages/education/table-education/table-education.component';
import { TableProjectComponent } from '@app/home/pages/project/table-project/table-project.component';
import { RouterModule, Routes } from '@angular/router';
import { TableSkillComponent } from '@app/home/pages/skill/table-skill/table-skill.component';
import { HomeComponent } from '@app/home/pages/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '', component: HomeComponent, children: [
      { path: 'institution', component: TableInstitutionComponent, title: 'Institutions' },
      { path: 'education', component: TableEducationComponent, title: 'Educations' },
      { path: 'skill', component: TableSkillComponent, title: 'Skills' },
      { path: 'technology', component: TableTechnologyComponent, title: 'Technologies' },
      { path: 'project', component: TableProjectComponent, title: 'Projects' },
      { path: 'social-network', component: TableSocialNetworkComponent, title: 'Social Networks' }
    ]
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
