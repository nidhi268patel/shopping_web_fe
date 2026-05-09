import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  ;
  mySubscription!: Subscription; // declare it
  constructor(
    private auth: UserService,
    private router: Router
  ) {
    this.auth.logout();
   }

  ngOnInit(): void { }

  login() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.mySubscription = this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {

        // 🔐 store token
        localStorage.setItem('token', res.token);

        // 🧍 store role safely
        localStorage.setItem('role', res.role?.toLowerCase());

        // 👤 store user
        localStorage.setItem('user', JSON.stringify(res));

        console.log('Login Success:', res);

        // 🚀 redirect based on role
        const role = res.role?.toLowerCase();

        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        }
        else if (role === 'user') {

          this.router.navigate(['/shop']);
        }
        else {

          this.router.navigate(['/login']);
        }
      },

      error: (err) => {
        console.error('Login Failed:', err);
        alert(err.error?.message || 'Login failed. Please try again.');
      }
    });
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe
    }
  }
}