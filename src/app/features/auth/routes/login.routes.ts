import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/auth/pages/login/login.component').then(
        (component) => component.LoginComponent,
      ),
  },
];
