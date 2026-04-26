import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AdminProductDetailsComponent } from './pages/admin-product-details/admin-product-details.component';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // 🛍 Public shop page (optional after login)
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [AuthGuard],   // attach your guard
    data: { role: 'user' }
  },
  // 📦 Product details (with guard optional)
  {
    path: 'product/:id',
    component: ProductDetailComponent
    // canDeactivate: [YourGuard]  ❌ only if you created guard
  },

  // 🛒 Protected routes
  { path: 'cart', component: CartComponent , canActivate: [AuthGuard],   // attach your guard
    data: { role: 'user' }},
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },

  // 🛠 Admin only
  {
    path: 'admin/products',
    component: AdminProductDetailsComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  // ❌ fallback route
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
