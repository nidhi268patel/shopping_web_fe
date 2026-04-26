import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const token = this.userService.getToken();
    const role = this.userService.getRole();
    console.log("token---false");

    // ❌ Not logged in
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    console.log("token---token");

    // 🛡 Role check
    const expectedRole = route?.data['role'];
    console.log("expectedRole---expectedRole", expectedRole);

    if (expectedRole && role && role.toLowerCase() !== expectedRole.toLowerCase()) {
      this.router.navigate(['/access-denied']);
      console.log("route---false");

      return false;
    }
    console.log("route---true");

    return true;
  }
}