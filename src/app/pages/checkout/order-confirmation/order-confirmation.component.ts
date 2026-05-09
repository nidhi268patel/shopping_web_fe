import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Address } from 'src/app/core/constant';



interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent {
  @Input() orderId: string = '';
  @Input() deliveryAddress: Address | null = null;
  @Input() orderItems: OrderItem[] = [];
  @Input() subtotal: number = 0;
  @Input() discount: number = 0;
  @Input() gst: number = 0;
  @Input() shippingCost: number = 0;
  @Input() totalAmount: number = 0;
  @Input() paymentMethod: string = 'Cash on Delivery';

  @Output() continueShopping = new EventEmitter<void>();
  @Output() viewOrder = new EventEmitter<void>();

  continueShoppingClick() {
    this.continueShopping.emit();
  }

  viewOrderClick() {
    this.viewOrder.emit();
  }
}
