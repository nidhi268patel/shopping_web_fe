import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

export interface AdminOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  status: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  date: Date;
  total: number;
  isExpanded: boolean;
  items: AdminOrderItem[];
}



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'products' | 'orders' | 'users' = 'products';
  
  userDetails: any = null;
  isLoggedIn: boolean = false; // Added to track login status

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadDummyData();
    this.checkLoginStatus(); // Load user details and login status on component initialization
  }

  logout(): void {
    this.userService.logout(); // Use the shared UserService for logout logic
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  loadDummyData(): void {


 
  }

  switchTab(tab: 'products' | 'orders' | 'users'): void {
    this.activeTab = tab;
  }

  

  

    checkLoginStatus(): void {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!localStorage.getItem('token') && !!user; // Check if token and user data exist
    if (user) {
      try {
        this.userDetails = JSON.parse(user);
      } catch {
        this.userDetails = null;
      }
    }
  }
}