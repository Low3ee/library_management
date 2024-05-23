import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../service/JwtService';
import { UserService } from '../../repository/user/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  form: any;
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$';

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      contact_no: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
      year_level: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      cpassword: new FormControl('', [Validators.required]),
    });

    // Apply the custom validator for password matching
    this.form.setValidators(passwordMatchValidator);
  }

  errorMessage: string = '';

  user: any = {};

  registerUser(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.userService.registerUser(this.form.value).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);
        if (this.user) {
          // Automatically log in the user after successful registration
          this.loginUser();
        }
      },
      (error) => {
        this.errorMessage =
          error.error.message || 'An error occurred. Please try again.';
      }
    );
  }

  loginUser(): void {
    const creds =
      this.form.get('username')?.value || this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    const loginCredentials = {
      creds,
      password,
    };

    this.userService.loginUser(loginCredentials).subscribe(
      (response: any) => {
        const token = response.token;
        console.log(`from component ${response}`);
        localStorage.setItem('token', JSON.stringify(token));

        if (this.jwtService.getRole() > 1) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.errorMessage =
          error.error.message ||
          'An error occurred during login. Please try again.';
      }
    );
  }
}

// Custom validator function
function passwordMatchValidator(
  group: FormGroup
): { [key: string]: boolean } | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('cpassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}
