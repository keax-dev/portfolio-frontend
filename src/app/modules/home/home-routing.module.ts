import { TableInstitutionComponent } from '@app/home/pages/institution/table-institution/table-institution.component';
import { TableEducationComponent } from '@app/home/pages/education/table-education/table-education.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/home/pages/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '', component: HomeComponent, children: [
      { path: 'institution', component: TableInstitutionComponent, title: 'Institutions' },
      { path: 'education', component: TableEducationComponent, title: 'Educations' }
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
