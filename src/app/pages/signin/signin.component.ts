import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../repository/user/user.service';
import { JwtService } from '../../service/JwtService';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  userForm: any;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      creds: new FormControl('', { validators: Validators.required }),
      password: new FormControl('', { validators: Validators.required }),
    });
  }

  get creds() {
    return this.userForm.get('creds');
  }

  get password() {
    return this.userForm.get('password');
  }

  loginUser(): void {
    if (this.userForm.invalid) {
      this.validateForm();
      return;
    }

    this.userService.loginUser(this.userForm.value).subscribe(
      (response: any) => {
        // Handle successful response
        const token = response.token;
        console.log('Login successful');
        localStorage.setItem('token', token);

        // Redirect the user based on their role
        if (this.jwtService.getRole() > 1) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        // Log the full error object for inspection
        console.error('Error from server:', error);

        // Set a generic error message
        this.errorMessage = error;
      }
    );
  }

  validateForm() {
    if (this.creds?.invalid) {
      this.errorMessage = 'Please enter username/email.';
    } else if (this.password?.invalid) {
      this.errorMessage = 'Password is required.';
    }
  }
}
