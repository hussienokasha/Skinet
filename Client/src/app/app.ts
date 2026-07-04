import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HttpClient } from '@angular/common/http';
import { Pagination } from './core/models/pagination';
import { Product } from './core/models/product';
import { ProductService } from './core/services/product-service';
import { Shop } from "./features/shop/shop";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Header, Shop],
})
export class App {

}
