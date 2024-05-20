import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../service/JwtService';
import { UserService } from '../../repository/user/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    contact_no: new FormControl(''),
    course: new FormControl(''),
    year_level: new FormControl(''),
    password: new FormControl(''),
    cpassword: new FormControl(''),
  });

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    // if (this.jwtService.getToken()) {
    //   this.router.navigate(['/']);
    // }
  }

  errorMessage: string = '';

  user: any = {};

  registerUser(): void {
    this.userService.registerUser(this.form.value).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);
        if (this.user != null) {
          this.router.navigate(['/signin']);
        }
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
