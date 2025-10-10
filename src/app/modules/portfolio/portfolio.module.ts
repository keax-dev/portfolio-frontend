import { ProjectCarouselComponent } from './technology/project-carousel/project-carousel.component';
import { CardEducationComponent } from './education/card-education/card-education.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { TechnologyComponent } from './technology/technology.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { EducationComponent } from './education/education.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AccordionModule } from 'primeng/accordion';
import { FooterComponent } from './footer/footer.component';
import { SkillComponent } from './skill/skill.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ProjectCarouselComponent,
    CardEducationComponent,
    TechnologyComponent,
    PortfolioComponent,
    EducationComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    SkillComponent
  ],
  imports: [
    PortfolioRoutingModule,
    AccordionModule,
    CommonModule
  ]
})
export default class PortfolioModule { }
