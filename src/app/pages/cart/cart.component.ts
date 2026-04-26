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
  constructor(private cart: CartService) { }
  ngOnInit(): void { this.load(); this.cart.observeCart().subscribe(() => this.load()); }
  load() {
    this.items = this.cart.getCartItems();
    this.total = this.cart.getTotal();
    this.calculateTotal();

  }
  remove(id: number) { this.cart.removeFromCart(id); }
  updateQuantity(item: any) {


    // Update localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const index = cart.findIndex((c: any) => c.id === item.id);
    if (item.quantity < 1) {
      item.quantity = 1; // prevent zero or negative
    }
    if (index !== -1) {
      cart[index].quantity = item.quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Optionally refresh items array
    this.items = cart;
    this.calculateTotal();
  }
  subtotal = 0;
  discount = 0;
  gst = 0;
  shippingCost = 0;
  calculateTotal(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0);

    // Apply coupon discount if any
    // let discountAmount = 0;
    // if (this.couponApplied && this.couponDiscount > 0) {
    //   discountAmount = Math.floor(this.subtotal * (this.couponDiscount / 100));
    // } else {
    //   discountAmount = Math.floor(this.subtotal * 0.05); // Default 5% discount
    // }
    this.discount = this.items.reduce((sum, item) => sum + (item.mrpPrice - item.price) * item.quantity, 0);

    // Calculate GST (5% on subtotal after discount)
    // const taxableAmount = this.subtotal - this.discount;
    // this.gst = Math.floor(taxableAmount * 0.05);

    // Free shipping above 500
    this.shippingCost = this.subtotal > 500 ? 0 : 50;

    // Total
    this.total = this.subtotal - this.discount + this.shippingCost;
  }

}
