import { DatePipe } from "@angular/common";

 export const categories:string[] = [
  "Electronics",
  "Fashion & Apparel",
  "Groceries & Essentials",
  "Home & Furniture",
  "Books & Stationery",
  "Health & Beauty",
  "Sports & Fitness",
  "Toys & Baby Products",
  "Automotive",
  "Digital Products & Services",
  "Other"
];

export interface Address {
  id?: number;
  userId: number;
  name: string;
  mobile: string;
  pincode: string;
  street: string;
  city: string;
  state: string;
  type: string;       // Home / Work / Other
  isDefault?: boolean;
}
 
// CreateOrderRequest.ts
export interface CreateOrderRequest {
  userId: number;
  addressId: number;
  items: OrderItemRequest[];
  paymentMethod: string;   // "COD" | "UPI" | "CARD"
  transactionId?: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
   // optional for prepaid
}

// OrderResponse.ts
export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string;       // ISO date string
  overallStatus: string;

  name: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: string;

  items: OrderItemResponse[];
}

// OrderItemResponse.ts
export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  shippingFee: number;
  amount: number;

  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  paidAt?: string;

  courierName?: string;
  trackingNumber?: string;
  expectedDelivery?: string;

  statusHistory: ItemStatusHistoryResponse[];
}

// ItemStatusHistoryResponse.ts
export interface ItemStatusHistoryResponse {
  status: string;
  timestamp: string; // ISO date string
}

export interface ItemStatusHistoryDTO {
  status: string;
  timestamp: string;
}

export interface OrderItemDto {
  itemId: number;
  orderId: number;

  productName: string;
  imageBase64: string;
  quantity: number;
  price: number;
  shippingFee: number;
  amount: number;

  status: string;

  paymentMethod: string;
  paymentStatus: string;

  courier: string;
  trackingNumber: string;

  // Address
  name: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isExpanded?: boolean; // For UI expand/collapse
  history: ItemStatusHistoryDTO[];
}

export interface UpdateItemStatus {
  itemId: number;
  status: string;
  updatedAt?: string; // ISO date string
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}