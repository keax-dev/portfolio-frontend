import { TableSocialNetworkComponent } from './pages/social-network/table-social-network/table-social-network.component';
import { FrmSocialNetworkComponent } from './pages/social-network/frm-social-network/frm-social-network.component';
import { TableInstitutionComponent } from '@app/home/pages/institution/table-institution/table-institution.component';
import { TableTechnologyComponent } from './pages/technology/table-technology/table-technology.component';
import { TableEducationComponent } from '@app/home/pages/education/table-education/table-education.component';
import { FrmInstitutionComponent } from '@app/home/pages/institution/frm-institution/frm-institution.component';
import { FrmTechnologyComponent } from './pages/technology/frm-technology/frm-technology.component';
import { FrmEducationComponent } from '@app/home/pages/education/frm-education/frm-education.component';
import { TableProjectComponent } from './pages/project/table-project/table-project.component';
import { FrmProjectComponent } from './pages/project/frm-project/frm-project.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FrmProfileComponent } from './pages/profile/frm-profile/frm-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableSkillComponent } from './pages/skill/table-skill/table-skill.component';
import { HomeRoutingModule } from '@app/home/home-routing.module';
import { FrmSkillComponent } from './pages/skill/frm-skill/frm-skill.component';
import { ComponentsModule } from '@app/components/components.module';
import { InputTextModule } from 'primeng/inputtext';
import { HomeComponent } from '@app/home/pages/home/home.component';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    TableSocialNetworkComponent,
    FrmSocialNetworkComponent,
    TableInstitutionComponent,
    TableTechnologyComponent,
    FrmInstitutionComponent,
    TableEducationComponent,
    FrmTechnologyComponent,
    TableProjectComponent,
    FrmEducationComponent,
    FrmProjectComponent,
    FrmProfileComponent,
    TableSkillComponent,
    FrmSkillComponent,
    HomeComponent
  ],
  imports: [
    DynamicDialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    ComponentsModule,
    InputTextModule,
    SelectModule,
    CommonModule
  ]
})
export default class HomeModule { }
