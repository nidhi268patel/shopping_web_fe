import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AppComponent } from './app.component';
import { ShopComponent } from './pages/shop/shop.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminProductDetailsComponent } from './pages/admin-product-details/admin-product-details.component';  // ✅ ADD THIS

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ShopComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    AdminProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: ShopComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      {path: 'admin/products', component: AdminProductDetailsComponent }
    ])
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeEnIn);
