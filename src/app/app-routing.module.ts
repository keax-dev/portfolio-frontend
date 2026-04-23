import { RouterModule, Routes } from '@angular/router';
import { guestMatchGuard } from '@core/guards/guest.guard';
import { authMatchGuard } from '@core/guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', title: 'Keax',
    loadChildren: () => import('./features/portfolio/modules/portfolio.module').then((m) => m.PortfolioModule)
  },
  {
    path: 'login',
    title: 'Login',
    canMatch: [guestMatchGuard],
    loadChildren: () => import('./features/auth/modules/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'home',
    title: 'Home',
    canMatch: [authMatchGuard],
    loadChildren: () => import('./features/admin/modules/home.module').then((m) => m.HomeModule)
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
