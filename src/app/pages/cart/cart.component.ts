import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total = 0;
  constructor(private cart: CartService) {}
  ngOnInit(): void { this.load(); this.cart.observeCart().subscribe(()=> this.load()); }
  load() { this.items = this.cart.getCartItems(); this.total = this.cart.getTotal(); }
  remove(id: number) { this.cart.removeFromCart(id); }
}
