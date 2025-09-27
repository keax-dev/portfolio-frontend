import { TableInstitutionComponent } from '@app/home/pages/institution/table-institution/table-institution.component';
import { TableEducationComponent } from '@app/home/pages/education/table-education/table-education.component';
import { FrmInstitutionComponent } from '@app/home/pages/institution/frm-institution/frm-institution.component';
import { FrmEducationComponent } from '@app/home/pages/education/frm-education/frm-education.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { HomeRoutingModule } from '@app/home/home-routing.module';
import { ComponentsModule } from '@app/components/components.module';
import { InputTextModule } from 'primeng/inputtext';
import { HomeComponent } from '@app/home/pages/home/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    TableInstitutionComponent,
    FrmInstitutionComponent,
    TableEducationComponent,
    FrmEducationComponent,
    HomeComponent
  ],
  imports: [
    DynamicDialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    ComponentsModule,
    InputTextModule,
    CommonModule
  ]
})
export default class HomeModule { }
