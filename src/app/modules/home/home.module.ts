import { TableInstitutionComponent } from '@app/home/pages/institution/table-institution/table-institution.component';
import { TableEducationComponent } from '@app/home/pages/education/table-education/table-education.component';
import { FrmInstitutionComponent } from '@app/home/pages/institution/frm-institution/frm-institution.component';
import { FrmEducationComponent } from '@app/home/pages/education/frm-education/frm-education.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableSkillComponent } from './pages/skill/table-skill/table-skill.component';
import { UppercaseDirective } from './pages/directive/uppercase.directive';
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
    TableInstitutionComponent,
    FrmInstitutionComponent,
    TableEducationComponent,
    FrmEducationComponent,
    TableSkillComponent,
    UppercaseDirective,
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
