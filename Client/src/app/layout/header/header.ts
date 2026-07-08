
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '../../core/services/loading-service';
import { CartService } from '../../core/services/cart-service';



@Component({
  selector: 'app-header',
  imports: [ButtonModule,RouterLink, RouterLinkActive ,ProgressBarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 isMobileMenuOpen = signal(false);
 load = inject(LoadingService);
 cartService= inject(CartService);


  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }
  ngOnInit(){
    this.cartService.getCart();
  }

}
