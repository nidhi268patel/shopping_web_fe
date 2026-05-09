import { Component, OnInit } from '@angular/core';
import { OrderItemDto } from 'src/app/core/constant';
import { OrderService } from 'src/app/core/order.service';

@Component({
  selector: 'my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders: OrderItemDto[] = [];
  allOrders: OrderItemDto[] = [];
  searchQuery: string = '';
  userDetails: any;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.getMyOrders();
  }





  toggleExpand(item: OrderItemDto): void {
    item.isExpanded = !item.isExpanded;
  }

  cancelItem(item: OrderItemDto): void {
    this.orderService.updateStatus({ itemId: item.itemId as unknown as number, status: 'CANCELLED' }).subscribe({
      next: (res) => {
        console.log('Item cancelled successfully:', res);
        item.status = 'CANCELLED';
        this.getMyOrders();
      },
      error: (err) => {
        console.error('Error cancelling item:', err);
        alert(err.error?.message || 'Failed to cancel item. Please try again.');
      }
    });
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  getMyOrders(): void {
    this.orderService.getItemsByUser(this.userDetails.id).subscribe(
      (response) => {
        this.orders = response;
        this.allOrders = [...response];
        this.filterOrders();
      })
  }

  filterOrders(): void {
    if (!this.searchQuery) {
      this.orders = [...this.allOrders];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();

    this.orders = this.allOrders.filter(item => {
      const matchesProductName = item.productName?.toLowerCase().includes(query);
      const matchesOrderId = item.orderId?.toString().includes(query);
      const matchesItemId = item.itemId?.toString().includes(query);

      return matchesProductName || matchesOrderId || matchesItemId;
    });
  }
}
