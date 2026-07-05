import { Routes } from '@angular/router';

export const portfolioRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/portfolio/pages/portfolio/portfolio.component').then(
        (component) => component.PortfolioComponent,
      ),
  },
];
