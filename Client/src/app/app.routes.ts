import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Shop } from './features/shop/shop';
import { ShopDetails } from './features/shop-details/shop-details';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'shop', component: Shop },
  { path: 'shop/:id', component: ShopDetails },
  { path: '**', redirectTo: '' },
];
