import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { Address } from 'src/app/core/constant';
import { AddressService } from 'src/app/core/address.service';
import { UserService } from 'src/app/core/user.service';
import { OrderService } from 'src/app/core/order.service';



interface PaymentMethod {
  label: string;
  value: string;
  icon: string;
}

interface CouponCode {
  code: string;
  discount: number; // percentage
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  addresses: Address[] = [];
  cartItems: any[] = [];
  totalAmount = 0;
  subtotal = 0;
  discount = 0;
  gst = 0;
  shippingCost = 0;
  selectedAddress!: Address;
  paymentMethod: string = 'COD';

  // Modal state
  showAddressModal = false;
  editingAddress: Address | null = null;

  // Order confirmation state
  showConfirmation = false;
  orderId: string = '';

  // Coupon state
  couponCode: string = '';
  couponApplied = false;
  couponError: string = '';
  couponMessage: string = '';
  couponDiscount: number = 0;
  userDetails: any;
  // Available coupons
  availableCoupons: CouponCode[] = [
    { code: 'SAVE10', discount: 10 },
    { code: 'SAVE20', discount: 20 },
    { code: 'SAVE50', discount: 50 }
  ];

  paymentMethods: PaymentMethod[] = [
    { label: 'Cash on Delivery', value: 'COD', icon: '💵' },
    { label: 'UPI', value: 'UPI', icon: '📱' },
    { label: 'Credit/Debit Card', value: 'Card', icon: '💳' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private addressService: AddressService,
    private userService: UserService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.userDetails = this.userService.getUser();
    this.loadCart();
    this.loadAddresses();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.calculatePrices();
  }

  loadAddresses() {
    // Mock addresses - replace with actual service call
    this.addressService.getAddresses(this.userDetails?.id).subscribe((addresses) => {
      this.addresses = addresses;
      if (this.addresses.length > 0) {
        this.selectedAddress = this.addresses[0];
      } else {
        this.selectedAddress = null as any;
      }
    });

  }

  calculatePrices() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0);

    // Apply coupon discount if any
    // let discountAmount = 0;
    // if (this.couponApplied && this.couponDiscount > 0) {
    //   discountAmount = Math.floor(this.subtotal * (this.couponDiscount / 100));
    // } else {
    //   discountAmount = Math.floor(this.subtotal * 0.05); // Default 5% discount
    // }
    this.discount = this.cartItems.reduce((sum, item) => sum + (item.mrpPrice - item.price) * item.quantity, 0);

    // Calculate GST (5% on subtotal after discount)
    // const taxableAmount = this.subtotal - this.discount;
    // this.gst = Math.floor(taxableAmount * 0.05);

    // Free shipping above 500
    this.shippingCost = this.subtotal > 500 ? 0 : 50;

    // Total
    this.totalAmount = this.subtotal - this.discount + this.shippingCost;
  }

  openAddressModal(address?: Address) {
    this.editingAddress = address || null;
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.editingAddress = null;
  }

  saveAddress(address: Address) {
    if (address.id && this.addresses.find(a => a.id === address.id)) {
      // Update existing
      const index = this.addresses.findIndex(a => a.id === address.id);
      this.addresses[index] = address;
    } else {
      // Add new
      address.id = Date.now();
      this.addresses.push(address);
    }

    // Save to localStorage
    localStorage.setItem('addresses', JSON.stringify(this.addresses));
    this.closeAddressModal();
  }

  selectAddress(addr: Address) {
    this.selectedAddress = addr;
  }

  deleteAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addresses = this.addresses.filter(a => a.id !== id);
      localStorage.setItem('addresses', JSON.stringify(this.addresses));
      if (this.selectedAddress?.id === id) {
        this.selectedAddress = null as any;
      }
    }
  }

  // applyCoupon() {
  //   this.couponError = '';
  //   this.couponMessage = '';

  //   if (!this.couponCode.trim()) {
  //     this.couponError = 'Please enter a coupon code';
  //     return;
  //   }

  //   const coupon = this.availableCoupons.find(
  //     c => c.code.toUpperCase() === this.couponCode.toUpperCase()
  //   );

  //   if (coupon) {
  //     this.couponApplied = true;
  //     this.couponDiscount = coupon.discount;
  //     this.couponMessage = `Coupon applied! You get ${coupon.discount}% discount.`;
  //     this.calculatePrices();
  //   } else {
  //     this.couponError = 'Invalid coupon code';
  //     this.couponApplied = false;
  //     this.couponDiscount = 0;
  //   }
  // }

  placeOrder() {
    if (!this.selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.orderService.createOrder({
      userId: this.userDetails.id,
      addressId: this.selectedAddress.id!,
      paymentMethod: this.paymentMethod,
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }))
    }).subscribe({
      next: (order) => {
        // Generate order ID
        this.orderId = order.id.toString();

        // Show confirmation
        this.showConfirmation = true;
        setTimeout(() => {
          this.cartService.clearCart();
        }, 3000);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    });

    // Clear cart after successful order
    // (In real app, this would be done after backend confirms)

  }

  resetCheckout() {
    this.showConfirmation = false;
    this.cartItems = [];
    this.totalAmount = 0;
    this.subtotal = 0;
    this.discount = 0;
    this.gst = 0;
    this.shippingCost = 0;
    this.couponCode = '';
    this.couponApplied = false;
    this.couponDiscount = 0;
    this.selectedAddress = null as any;
    this.router.navigate(['/shop']);
  }

  viewOrderDetails() {
    this.showConfirmation = false;
    this.router.navigate(['/orders']);
  }
}
