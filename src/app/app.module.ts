import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AppComponent } from './app.component';
import { ShopComponent } from './pages/shop/shop.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminProductDetailsComponent } from './pages/admin/admin-product-details/admin-product-details.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthInterceptor } from './core/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AddressFormModalComponent } from './pages/checkout/address-form-modal/address-form-modal.component';
import { OrderConfirmationComponent } from './pages/checkout/order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/admin-orders.component';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ShopComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    AdminProductDetailsComponent,
    LoginComponent,
    SignupComponent,
    AddressFormModalComponent,
    OrderConfirmationComponent,
    MyOrdersComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminUserManagementComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeEnIn);
