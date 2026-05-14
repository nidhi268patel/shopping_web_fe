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

    this.auth.signup(data).subscribe((res: any) => {
        console.log('Signup Success:', res);

        alert('Signup successful 🎉');

        // redirect to login
        this.router.navigate(['/login']);
      },(err) => {

        const errorMessage =  JSON.parse(err.error);
        alert(errorMessage.message || 'Signup failed. Please try again.');
      }
    );
  }


}
