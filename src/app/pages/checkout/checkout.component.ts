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

  userDetails: any;


  paymentMethods: PaymentMethod[] = [
    { label: 'Cash on Delivery', value: 'COD', icon: '💵' },
    // { label: 'UPI', value: 'UPI', icon: '📱' },
    // { label: 'Credit/Debit Card', value: 'Card', icon: '💳' }
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
    this.discount = this.cartItems.reduce((sum, item) => sum + (item.mrpPrice - item.price) * item.quantity, 0);
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
    this.loadAddresses();
  }

  saveAddress(address: Address) {
    
    this.closeAddressModal();
  }

  selectAddress(addr: Address) {
    this.selectedAddress = addr;
  }

  deleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe({
      next: (res) => {
        console.log('Address deleted successfully:', res);      

        this.loadAddresses();
      },
      error: (err) => {
        console.error('Error deleting address:', err);
        alert(err.error?.message || 'Failed to delete address. Please try again.');
      }
    });
  }
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
        shippingFee: this.shippingCost / this.cartItems.length, // simple split of shipping cost
      }))
    }).subscribe({
      next: (order) => {
        this.orderId = order.id.toString();
        this.showConfirmation = true;
        setTimeout(() => {
          this.cartService.clearCart();
        }, 3000);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert(error.error.message || 'Failed to place order. Please try again.');
      }
    });
  }

  resetCheckout() {
    this.showConfirmation = false;
    this.cartItems = [];
    this.totalAmount = 0;
    this.subtotal = 0;
    this.discount = 0;
    this.gst = 0;
    this.shippingCost = 0;
    this.selectedAddress = null as any;
    this.router.navigate(['/shop']);
  }

  viewOrderDetails() {
    this.showConfirmation = false;
    this.router.navigate(['/orders']);
  }
}
