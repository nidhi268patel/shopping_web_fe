import { Component } from '@angular/core';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  items: any[] = [];
  total = 0;
  constructor(private cart: CartService) { this.load(); }
  load() { this.items = this.cart.getCartItems(); this.total = this.cart.getTotal(); }
  place() { alert('Order placed (demo).'); this.cart.clearCart(); this.load(); }
}
