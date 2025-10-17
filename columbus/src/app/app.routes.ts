import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin-guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/inicio/inicio').then((p) => p.Inicio),
  },
  {
    path: 'clases',
    loadComponent: () => import('./page/clases/clases').then((p) => p.Clases),
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login').then((p) => p.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./page/register/register').then((p) => p.Register),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./page/admin/admin').then((p) => p.Admin),
    children: [
      {
        path: 'perfil',
        loadComponent: () => import('./page/admin/perfil/perfil').then((p) => p.Perfil),
      },
      {
        path: 'clases',
        loadComponent: () => import('./page/clases/clases').then((p) => p.Clases),
      },
          {
        path: 'horario',
        loadComponent: () => import('./components/calendar/calendar').then((p) => p.Calendar),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
