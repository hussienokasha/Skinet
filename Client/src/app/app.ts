import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { AccountService } from './core/services/account-service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Header, RouterOutlet,ToastModule],
})
export class App {
  acoountService = inject(AccountService);

  ngOnInit(){
    this.acoountService.getCurrentUser().subscribe()
  }

}
