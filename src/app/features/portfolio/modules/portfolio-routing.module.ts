import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: PortfolioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }
