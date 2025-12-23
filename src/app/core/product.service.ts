import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  productId: number;                // Long → number in TS
  productName: string;
  productDescription: string;
  sellingPrice: number;             // Double → number
  mrpPrice: number;
  discountPercent: number;
  availableStock: number;           // Integer → number
  productCategory: string;
  imageContentType: string;
  productImageData: Uint8Array;     // byte[] → Uint8Array in TS
  imageBase64: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
 
   private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  create(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  update(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
