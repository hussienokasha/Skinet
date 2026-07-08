import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Shop } from './features/shop/shop';
import { ShopDetails } from './features/shop-details/shop-details';
import { Contact } from './features/contact/contact';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'shop', component: Shop, },
  { path: 'shop/:id', component: ShopDetails },
  { path: 'contact', component: Contact },
  { path: 'cart', component: Cart },
  {path:'checkout',component:Checkout},
  { path: '**', redirectTo: '' },
];
