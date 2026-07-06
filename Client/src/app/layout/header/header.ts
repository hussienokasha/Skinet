
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '../../core/services/loading-service';



@Component({
  selector: 'app-header',
  imports: [ButtonModule,RouterLink, RouterLinkActive,ProgressBarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 isMobileMenuOpen = signal(false);
 load = inject(LoadingService)

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

}
