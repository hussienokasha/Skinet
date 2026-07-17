import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '../../core/services/loading-service';
import { CartService } from '../../core/services/cart-service';
import { AccountService } from '../../core/services/account-service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, RouterLink, RouterLinkActive, ProgressBarModule,MenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isMobileMenuOpen = signal(false);
  load = inject(LoadingService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  router = inject(Router);
    items: MenuItem[] | undefined;



  ngOnInit() {
    this.cartService.getCart();
    this.items = [{ label: 'Logout', command: () => this.logout() }]
  }
    toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/login');

      }
    })
  }
}
