import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/core/cart.service';
import { ProductService, Product } from 'src/app/core/product.service';
import { SearchService } from 'src/app/core/search.service';
import { Subscription } from 'rxjs';
import { categories } from 'src/app/core/constant';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filtered: Product[] = [];
  primeOnly = false;
  searchQuery = '';
  
  // Filter properties
  selectedCategories: string[] = [];
  //readonly categories:string[] = categories
  
  categories: string[] = categories
  
  sortBy = 'relevant';
  priceRange = { min: 0, max: 100000 };
  minPriceInput = 0;
  maxPriceInput = 100000;
  showFilters = true;
  
  // Discount filter properties
  discount20 = false;
  discount40 = false;
  discount60 = false;

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
   // this.extractCategories();
    this.setMaxPrice();
    
    this.searchSub = this.search.observe().subscribe(q => {
      this.searchQuery = (q || '').toLowerCase().trim();
      this.applyFilters();
    });
    this.applyFilters();
  }

  extractCategories() {
    const uniqueCategories = new Set<string>();
    this.products.forEach(p => {
      if (p.productCategory) {
        uniqueCategories.add(p.productCategory);
      }
    });
    this.categories = Array.from(uniqueCategories).sort();
  }

  setMaxPrice() {
    if (this.products.length > 0) {
      const maxPrice = Math.max(...this.products.map(p => p.sellingPrice || 0));
      this.priceRange.max = Math.ceil(maxPrice / 1000) * 1000;
      this.maxPriceInput = this.priceRange.max;
    }
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
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
    
    // Category filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        this.selectedCategories.includes(p.productCategory)
      );
    }
    
    // Price range filter
    filtered = filtered.filter(p => 
      p.sellingPrice >= this.minPriceInput && p.sellingPrice <= this.maxPriceInput
    );
    
    // Discount filter
    const activeDiscounts = [];
    if (this.discount20) activeDiscounts.push(20);
    if (this.discount40) activeDiscounts.push(40);
    if (this.discount60) activeDiscounts.push(60);
    
    if (activeDiscounts.length > 0) {
      filtered = filtered.filter(p => {
        const discount = p.discountPercent || 0;
        return activeDiscounts.some(d => discount >= d);
      });
    }
    
    // Sorting
    filtered = this.sortProducts(filtered);
    
    this.filtered = filtered;
  }

  sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    switch (this.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
      case 'discount':
        return sorted.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      case 'newest':
        return sorted.sort((a, b) => (b.productId || 0) - (a.productId || 0));
      default:
        return sorted;
    }
  }

  clearFilters() {
    this.selectedCategories = [];
    this.minPriceInput = this.priceRange.min;
    this.maxPriceInput = this.priceRange.max;
    this.discount20 = false;
    this.discount40 = false;
    this.discount60 = false;
    this.sortBy = 'relevant';
    this.applyFilters();
  }

  updatePriceFilter() {
    this.applyFilters();
  }

  addToCart(p: Product) { 
    this.cart.addToCart({ id: p.productId, name: p.productName, price: p.sellingPrice,mrpPrice: p.mrpPrice, quantity: 1,imageBase64: p.imageBase64, stock: p.availableStock }); 
  }

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
     { name: 'Top Deals Under ₹999', filter: 'price', value: 999, },
    { name: 'Best of Mobiles', filter: 'category', value: 'Mobile' },
   // { name: 'Fashion Trending Now', filter: 'category', value: 'Fashion' },
    { name: 'Today\'s Offers', filter: 'discount', value: 20 },

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
  navigateToCart() {
    window.location.href = '/cart';
  }

  checkInCarPresent(p: Product): boolean {
    const cartItems = this.cart.getCartItems();   
    return cartItems.some(item => item.id === p.productId);
  }
  ngOnDestroy(): void {
        this.stopAutoPlay();
    this.searchSub?.unsubscribe();
  }


}
