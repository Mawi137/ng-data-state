import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'houses',
    loadChildren: () => import('./pages/houses/routes').then(r => r.routes)
  },
  {
    path: '**',
    redirectTo: 'houses'
  }
];
