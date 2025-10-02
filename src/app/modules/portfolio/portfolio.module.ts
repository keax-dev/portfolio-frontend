import { HeaderComponent } from './header/header.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    PortfolioComponent,
    HeaderComponent
  ],
  imports: [
    PortfolioRoutingModule,
    CommonModule
  ]
})
export default class PortfolioModule { }
