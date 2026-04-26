import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/core/cart.service';
import { SearchService } from 'src/app/core/search.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  private sub?: Subscription;
  @Input() query = '';
  
  isLoggedIn = false;
  userDetails: any = null;
  showAccountMenu = false;

  constructor(private cart: CartService, private search: SearchService, private router: Router) {
    this.checkLoginStatus();
  }

  ngOnInit(): void {
    this.search.observe().subscribe(q => {
      this.query = (q || '').toLowerCase().trim();
    });
    this.sub = this.cart.observeCart().subscribe(items => this.cartCount = items.reduce((s, i) => s + i.quantity, 0));
  }

  checkLoginStatus(): void {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!localStorage.getItem('token') && !!user;
    if (user) {
      try {
        this.userDetails = JSON.parse(user);
      } catch {
        this.userDetails = null;
      }
    }
  }

  onQueryChange(): void {
   this.search.setQuery(this.query || '');

  if (!this.router.url.startsWith('/shop')) {
    // Navigate to shop with query param if not already there
    this.router.navigate(['/shop']);
  } 
  }

  toggleAccountMenu(): void {
    this.showAccountMenu = !this.showAccountMenu;
  }

  closeAccountMenu(): void {
    this.showAccountMenu = false;
  }

  logout(): void {
    UserService.prototype.logout();
    this.isLoggedIn = false;
    this.userDetails = null;
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void { 
    this.sub?.unsubscribe(); 
  }
}
