import { ProjectCarouselComponent } from '@app/portfolio/pages/technology/project-carousel/project-carousel.component';
import { ProjectDetailsComponent } from './pages/technology/project-details/project-details.component';
import { CardEducationComponent } from '@app/portfolio/pages/education/card-education/card-education.component';
import { PortfolioRoutingModule } from '@app/portfolio/portfolio-routing.module';
import { TechnologyComponent } from '@app/portfolio/pages/technology/technology.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PortfolioComponent } from '@app/portfolio/pages/portfolio/portfolio.component';
import { EducationComponent } from '@app/portfolio/pages/education/education.component';
import { ContactComponent } from '@app/portfolio/pages/contact/contact.component';
import { ComponentsModule } from '@app/components/components.module';
import { HeaderComponent } from '@app/portfolio/pages/header/header.component';
import { NavbarComponent } from '@app/portfolio/pages/navbar/navbar.component';
import { AccordionModule } from 'primeng/accordion';
import { FooterComponent } from '@app/portfolio/pages/footer/footer.component';
import { SkillComponent } from '@app/portfolio/pages/skill/skill.component';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { LanguagePipe } from './pipe/language.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ProjectCarouselComponent,
    ProjectDetailsComponent,
    CardEducationComponent,
    TechnologyComponent,
    PortfolioComponent,
    EducationComponent,
    ContactComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    SkillComponent,
    LanguagePipe
  ],
  imports: [
    PortfolioRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    AccordionModule,
    SelectModule,
    CommonModule
  ]
})
export default class PortfolioModule { }
