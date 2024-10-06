import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./houses.page').then(c => c.HousesPage)
  },
  {
    path: ':houseId',
    loadComponent: () => import('./house-details.page').then(c => c.HouseDetailsPage)
  }
];
