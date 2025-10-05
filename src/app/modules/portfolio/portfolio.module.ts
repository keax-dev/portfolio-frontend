import { CardEducationComponent } from './education/card-education/card-education.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { EducationComponent } from './education/education.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    CardEducationComponent,
    PortfolioComponent,
    EducationComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    PortfolioRoutingModule,
    CommonModule
  ]
})
export default class PortfolioModule { }
