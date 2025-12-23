import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/core/cart.service';
import { SearchService } from 'src/app/core/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  private sub?: Subscription;
  query = '';
  constructor(private cart: CartService, private search: SearchService) {}
  ngOnInit(): void {
    this.sub = this.cart.observeCart().subscribe(items => this.cartCount = items.reduce((s, i) => s + i.quantity, 0));
  }
  onQueryChange(): void { this.search.setQuery(this.query || ''); }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
