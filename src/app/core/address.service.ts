import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from './constant';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseUrl = 'http://localhost:8080/api/addresses'; // adjust if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all addresses for a user
  getAddresses(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}?userId=${userId}`);
  }

  // ✅ Add new address
  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, address);
  }

  // ✅ Update existing address
  updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, address);
  }

  // ✅ Delete address
  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Set default address
  setDefaultAddress(id: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/default?userId=${userId}`, {});
  }
}
