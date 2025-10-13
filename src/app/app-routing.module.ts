import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', title: 'Keax',
    loadChildren: () => import('./modules/portfolio/portfolio.module')
  },
  {
    path: 'login', title: 'Login',
    loadChildren: () => import('./modules/login/login.module')
  },
  {
    path: 'home', title: 'Home',
    loadChildren: () => import('./modules/home/home.module')
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
