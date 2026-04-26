import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem { id: number; name: string; price: number; mrpPrice: number; quantity: number; imageBase64?: string; stock?: number; } 

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private subj = new BehaviorSubject<CartItem[]>(this.items);
  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) this.items = JSON.parse(stored);
    this.subj.next(this.items);
  }
  observeCart(): Observable<CartItem[]> { return this.subj.asObservable(); }
  addToCart(item: CartItem) {
    const found = this.items.find(i => i.id === item.id);
    if (found) found.quantity += item.quantity; else this.items.push({ ...item });
    this.save();
  }
  removeFromCart(id: number) { this.items = this.items.filter(i => i.id !== id); this.save(); }
  clearCart() { this.items = []; this.save(); }
  getCartItems() { return this.items.slice(); }
  getTotal() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); }
  private save() { localStorage.setItem('cart', JSON.stringify(this.items)); this.subj.next(this.items); }
}
