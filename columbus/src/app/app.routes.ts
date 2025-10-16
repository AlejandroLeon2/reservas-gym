import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/inicio/inicio').then(p => p.Inicio),
  },
  {
    path: 'clases',
    loadComponent: () => import('./page/clases/clases').then(p => p.Clases),
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login').then(p => p.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./page/register/register').then(p => p.Register),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
