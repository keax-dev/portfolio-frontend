import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home', title: 'Home',
    loadChildren: () => import('./modules/home/home.module')
  },
  {
    path: '', title: 'Keax',
    loadChildren: () => import('./modules/portfolio/portfolio.module')
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
