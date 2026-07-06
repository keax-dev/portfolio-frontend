import { guestMatchGuard } from '@core/guards/guest.guard';
import { authMatchGuard } from '@core/guards/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Portfolio',
    data: {
      description:
        'Portafolio público con perfil profesional, educación, habilidades, proyectos y contacto.',
    },
    loadChildren: () =>
      import('@features/portfolio/routes/portfolio.routes').then((m) => m.portfolioRoutes),
  },
  {
    path: 'login',
    title: 'Login',
    data: {
      description: 'Acceso autenticado al panel administrativo del portafolio.',
    },
    canMatch: [guestMatchGuard],
    loadChildren: () => import('@features/auth/routes/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'home',
    title: 'Admin',
    data: {
      description:
        'Panel administrativo protegido para gestionar el contenido del portafolio y revisar visitas.',
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
