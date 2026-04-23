import { ProjectCarouselComponent } from '@features/portfolio/pages/technology/project-carousel/project-carousel.component';
import { ProjectDetailsComponent } from '../pages/technology/project-details/project-details.component';
import { CardEducationComponent } from '@features/portfolio/pages/education/card-education/card-education.component';
import { PortfolioRoutingModule } from '@features/portfolio/modules/portfolio-routing.module';
import { TechnologyComponent } from '@features/portfolio/pages/technology/technology.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { EducationComponent } from '@features/portfolio/pages/education/education.component';
import { ShowImageComponent } from '../pages/technology/show-image/show-image.component';
import { ContactComponent } from '@features/portfolio/pages/contact/contact.component';
import { ComponentsModule } from '@shared/components/components.module';
import { HeaderComponent } from '@features/portfolio/pages/header/header.component';
import { NavbarComponent } from '@features/portfolio/pages/navbar/navbar.component';
import { AccordionModule } from 'primeng/accordion';
import { FooterComponent } from '@features/portfolio/pages/footer/footer.component';
import { SkillComponent } from '@features/portfolio/pages/skill/skill.component';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { LanguagePipe } from '../pipe/language.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ProjectCarouselComponent,
    ProjectDetailsComponent,
    CardEducationComponent,
    TechnologyComponent,
    PortfolioComponent,
    ShowImageComponent,
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
export class PortfolioModule { }
