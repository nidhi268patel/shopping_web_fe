import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/core/cart.service';
import { ProductService, Product } from 'src/app/core/product.service';
import { SearchService } from 'src/app/core/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filtered: Product[] = [];
  primeOnly = false;
  searchQuery = '';
  selectedCategory = '';  // New property
 sliderTabs = [
    { name: 'Top Deals Under ₹999', filter: 'price', value: 999 },
    { name: 'Best of Mobiles', filter: 'category', value: 'Mobile' },
    { name: 'Fashion Trending Now', filter: 'category', value: 'Fashion' },
    { name: 'Today\'s Offers', filter: 'discount', value: 20 },
    { name: 'New Arrivals for You', filter: 'newest', value: null }
  ];
  private searchSub?: Subscription;

  constructor(private ps: ProductService, private cart: CartService, private search: SearchService) {}

  ngOnInit(): void {
        this.startAutoPlay();
   this.loadProducts();
    

  }
 async loadProducts() {
    this.products = await this.ps.getAll().toPromise() as Product[];
    this.searchSub = this.search.observe().subscribe(q => {
      this.searchQuery = (q || '').toLowerCase().trim();
      this.applyFilters();
    });
    this.applyFilters();

    console.log(this.products);
  }
  applyFilters() {
    let filtered = [...this.products];
    
    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const name = (p.productName || '').toLowerCase();
        const desc = (p.productDescription || '').toLowerCase();
        return name.includes(this.searchQuery) || desc.includes(this.searchQuery);
      });
    }
    
    // New category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.productCategory === this.selectedCategory);
    }
    
    this.filtered = filtered;
  }

  addToCart(p: Product) { this.cart.addToCart({ id: p.productId, name: p.productName, price: p.mrpPrice, quantity: 1 }); }

  setImagePlaceholder(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20">No Image</text></svg>';
  }

  getSliderProducts(tab: any): Product[] {
    let products = [...this.products];
    
    switch(tab.filter) {
      case 'price':
        products = products.filter(p => p.sellingPrice <= tab.value);
        break;
      case 'category':
        products = products.filter(p => p.productCategory === tab.value);
        break;
      case 'discount':
        products = products.filter(p => (p.discountPercent || 0) > tab.value);
        break;
      case 'newest':
        products = products.sort((a, b) => 
          (b.productId || 0) - (a.productId || 0)
        );
        break;
    }
    
    return products.slice(0, 6); // Top 6 products
  }

   carouselSlides = [
     { name: 'Top Deals Under ₹999', filter: 'price', value: 999,image: '/assets/images/under999.jpg' },
    { name: 'Best of Mobiles', filter: 'category', value: 'Mobile',image: '/assets/images/mobiledeal.jpg'  },
   // { name: 'Fashion Trending Now', filter: 'category', value: 'Fashion' },
    { name: 'Today\'s Offers', filter: 'discount', value: 20,image: '/assets/images/todaysoffer.jpg'  },

  ];

  currentSlide = 0;
  autoPlayInterval: any;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? 
      this.carouselSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(sliderTabs: any, index: number) {
    this.currentSlide = index;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  onHover() {
    this.stopAutoPlay();
  }

  onLeave() {
    this.startAutoPlay();
  }
  ngOnDestroy(): void {
        this.stopAutoPlay();
    this.searchSub?.unsubscribe();
  }


}
