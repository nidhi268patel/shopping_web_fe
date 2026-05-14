import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderRequest, OrderItemDto, OrderItemResponse, OrderResponse, UpdateItemStatus } from './constant';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

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
    getItemsByUser(userId: number): Observable<OrderItemDto[]> {
    return this.http.get<OrderItemDto[]>(
      `${this.baseUrl}/user/${userId}`
    );
  }

  // Cancel item
  cancelItem(orderId: number, itemId: number): Observable<OrderItemResponse> {
    return this.http.put<OrderItemResponse>(`${this.baseUrl}/${orderId}/items/${itemId}/cancel`, {});
  }

  // Update item status
   updateStatus(req: UpdateItemStatus): Observable<UpdateItemStatus> {
    return this.http.post<UpdateItemStatus>(
      `${this.baseUrl}/updateStatus`,
      req
    );
  }
   getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>( `${this.baseUrl}/allorders` );
  }
}
