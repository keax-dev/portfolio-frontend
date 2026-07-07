import { guestMatchGuard } from '@core/guards/guest.guard';
import { authMatchGuard } from '@core/guards/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Portfolio',
    data: {
      description:
        'Public portfolio with professional profile, education, skills, projects and contact information.',
    },
    loadChildren: () =>
      import('@features/portfolio/routes/portfolio.routes').then((m) => m.portfolioRoutes),
  },
  {
    path: 'login',
    title: 'Login',
    data: {
      description: 'Authenticated access to the portfolio administration panel.',
    },
    canMatch: [guestMatchGuard],
    loadChildren: () => import('@features/auth/routes/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'home',
    title: 'Admin',
    data: {
      description: 'Protected administration panel to manage portfolio content and review visits.',
    },
    canMatch: [authMatchGuard],
    loadChildren: () => import('@features/admin/routes/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
