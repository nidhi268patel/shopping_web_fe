import { Component, OnInit } from '@angular/core';
import { AdminOrder, AdminOrderItem } from '../admin-dashboard/admin-dashboard.component';
import { OrderService } from 'src/app/core/order.service';
import { UpdateItemStatus } from 'src/app/core/constant';

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  allOrders: AdminOrder[] = [];
  fromDate: string = '';
  toDate: string = '';
  searchOrderId: string = '';

  constructor(private orderService:OrderService) { 
    
  }

  ngOnInit(): void {
       this.getAllOrders();
  }
  toggleExpand(order: AdminOrder): void {
    order.isExpanded = !order.isExpanded;
  }

  updateItemStatus(item: AdminOrderItem, newStatus: string): void {
   if(item.status === newStatus) return; // No change

    const req :UpdateItemStatus = {
      itemId: item.id,
      status: newStatus
    };

    this.orderService.updateStatus(req).subscribe({
      next:(res )=>{
        console.log('Status updated successfully:', res);
        item.status = res.status; 
      },
      error:(err)=>{
        console.error('Error updating status:', err);
        alert(err.error?.message || 'Failed to update status. Please try again.');
      }
    }); 
  }

  isStatusDisabled(currentStatus: string, targetStatus: string): boolean {
    // Always allow the currently selected status to remain visible/selectable
    if (currentStatus === targetStatus) return false;

    const current = currentStatus ? currentStatus.toUpperCase() : '';
    const target = targetStatus ? targetStatus.toUpperCase() : '';

    // Once delivered or cancelled, no further updates are allowed
    if (current === 'DELIVERED' || current === 'CANCELLED') return true;
    // "Cancelled" is always an available option until the order is delivered
    if (target === 'CANCELLED') return false;

    const statuses = ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statuses.indexOf(current);
    const targetIndex = statuses.indexOf(target);

    // If unknown status (e.g., 'PENDING'), only allow moving to CONFIRMED
    if (currentIndex === -1) return target !== 'CONFIRMED';

    // Strict sequence: Only allow moving exactly 1 step forward in the array
    return targetIndex !== currentIndex + 1;
  }

  getAllOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next:(res:any)=>{
        console.log('Orders fetched successfully:', res);
        this.orders = res.map((order: any) => ({
          id: order.orderId,
          customerName: order.userName,
          date: new Date(order.orderDate),
          total: order.totalAmount,
          isExpanded: false,
          items: order.items.map((item: any) => ({
            id: item.itemId,
            name: item.productName,
            quantity: item.quantity,
            price: item.price,
            status: item.status
          }))
        }));
        this.allOrders = [...this.orders];
      }
      ,  
      error:(err)=>{
        console.error('Error fetching orders:', err);
      }
    });
   }

  filterOrders(): void {
    if (!this.fromDate && !this.toDate && !this.searchOrderId) {
      this.orders = [...this.allOrders];
      return;
    }

    this.orders = this.allOrders.filter(order => {
      let matchesDate = true;
      let matchesId = true;

      if (this.fromDate || this.toDate) {
        const fromDateObj = this.fromDate ? new Date(this.fromDate) : new Date(0);
        const toDateObj = this.toDate ? new Date(this.toDate) : new Date();
        if (this.toDate) {
           // Include the entire day to the last millisecond for the 'To' date
           toDateObj.setHours(23, 59, 59, 999);
        }
        matchesDate = order.date >= fromDateObj && order.date <= toDateObj;
      }

      if (this.searchOrderId) {
        matchesId = order.id.toString().toLowerCase().includes(this.searchOrderId.toLowerCase().trim());
      }

      return matchesDate && matchesId;
    });
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.searchOrderId = '';
    this.orders = [...this.allOrders];
  }
}
