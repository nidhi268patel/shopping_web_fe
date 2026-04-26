import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  name = '';
  email = '';
  password = '';

  constructor(
    private auth: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  signup() {

    const data = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.auth.signup(data).subscribe({
      next: (res: any) => {
        console.log('Signup Success:', res);

        alert('Signup successful 🎉');

        // redirect to login
        this.router.navigate(['/login']);
      },

      error: (err) => {
        console.error('Signup Error:', err);

        alert('Signup failed ❌ Please try again');
      }
    });
  }

}
