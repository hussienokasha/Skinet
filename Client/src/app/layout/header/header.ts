
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-header',
  imports: [ButtonModule,],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

}
