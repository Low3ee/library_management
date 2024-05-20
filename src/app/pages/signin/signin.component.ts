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
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  userForm: any;
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
  errorMessage: string = '';

  get creds() {
    return this.userForm.creds;
  }
  get password() {
    return this.userForm.password;
  }

  user: any = [];

  loginUser(): void {
    this.userService.loginUser(this.userForm.value).subscribe(
      (response: any) => {
        this.user = response.token;
        console.log(`from component ${response}`);
        localStorage.setItem('token', JSON.stringify(this.user));

        if (this.jwtService.getRole() > 1) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
  validateForm() {
    if (!this.creds && !this.password) {
      this.errorMessage = 'Please fill all fields.';
      return this.errorMessage;
    } else if (this.userForm.controls.password.errors?.['required']) {
      this.errorMessage = 'Password is required';
      return this.errorMessage;
    } else if (this.userForm.controls.creds.errors?.['required']) {
      this.errorMessage = 'Please enter username/email.';
      return this.errorMessage;
    }
    this.errorMessage = '';
    return this.errorMessage;
  }
}
