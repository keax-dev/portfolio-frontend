import { TableEducationComponent } from './pages/education/table-education/table-education.component';
import { FrmEducationComponent } from './pages/education/frm-education/frm-education.component';
import { HomeRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../components/components.module';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    TableEducationComponent,
    FrmEducationComponent,
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    ComponentsModule,
    CommonModule
  ]
})
export default class HomeModule { }
