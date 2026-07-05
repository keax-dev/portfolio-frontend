import { guestMatchGuard } from '@core/guards/guest.guard';
import { authMatchGuard } from '@core/guards/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Keax',
    loadChildren: () =>
      import('@features/portfolio/routes/portfolio.routes').then((m) => m.portfolioRoutes),
  },
  {
    path: 'login',
    title: 'Login',
    canMatch: [guestMatchGuard],
    loadChildren: () => import('@features/auth/routes/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'home',
    title: 'Home',
    canMatch: [authMatchGuard],
    loadChildren: () => import('@features/admin/routes/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
