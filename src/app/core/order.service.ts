import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderRequest, OrderItemResponse, OrderResponse } from './constant';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, request);
  }

  // Get order by ID
  getOrder(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`);
  }

  // Get all orders for a user
  getOrdersByUser(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Cancel item
  cancelItem(orderId: number, itemId: number): Observable<OrderItemResponse> {
    return this.http.put<OrderItemResponse>(`${this.baseUrl}/${orderId}/items/${itemId}/cancel`, {});
  }

  // Update item status
  updateItemStatus(orderId: number, itemId: number, status: string): Observable<OrderItemResponse> {
    return this.http.put<OrderItemResponse>(
      `${this.baseUrl}/${orderId}/items/${itemId}/status?status=${status}`, {}
    );
  }
}
