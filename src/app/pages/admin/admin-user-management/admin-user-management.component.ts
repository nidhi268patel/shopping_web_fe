import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/constant';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  toggleUserStatus(user: User): void {
    if(user.role === 'admin') return ;
    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    this.userService.updateStatus(user).subscribe(() => {
      this.getAllUsers(); // Refresh the user list after updating status
      alert(`User ${user.name} status updated to ${user.status}`);

    }, error => {
      this.getAllUsers(); // Refresh the user list after updating status
      console.error('Error updating user status:', error);
    });
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }
}
