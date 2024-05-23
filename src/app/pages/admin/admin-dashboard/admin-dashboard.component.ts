import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../service/JwtService';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../repository/user/user.service';
import { BooksService } from '../../../repository/books/books.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  formMessage: any;
  addBookForm: any;
  checkOutBookForm: any;
  returnBookForm: any;
  registerStudent: any;
  issuer: any;

  refresh() {
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        this.formMessage = '';
        this.addBookForm.reset();
        this.returnBookForm.reset();
        this.checkOutBookForm.reset();
      }
    });
  }

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private booksService: BooksService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    initFlowbite();
    if (this.jwtService.getToken()) {
      if (this.jwtService.getRole() == 1) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/signin']);
    }

    this.addBookForm = this.fb.group({
      name: ['', Validators.required],
      author: ['', Validators.required],
      condition: ['', Validators.required],
      category: ['', Validators.required],
      added_by: [this.jwtService.getUserId()],
    });

    this.checkOutBookForm = this.fb.group({
      bookId: ['', Validators.required],
      user_id: ['', Validators.required],
      issuer: [this.issuer as string],
      date_due: ['', Validators.required],
    });

    this.returnBookForm = this.fb.group({
      checkoutId: ['', Validators.required],
      studentId: ['', Validators.required],
      penalty: [''],
      remarks: ['', Validators.required],
    });

    this.registerStudent = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_no: ['', Validators.required],
    });

    this.issuer = this.jwtService.getUserId();
  }

  async onRegisterBook(): Promise<void> {
    if (this.addBookForm.valid) {
      try {
        const response = await this.booksService.registerBook(
          this.addBookForm.value
        );
        if (response.data.error) {
          this.formMessage = response.data.error.message;
        } else {
          this.formMessage = response.data.message;
          this.refresh();
        }
      } catch (err) {
        this.formMessage = this.getErrorMessage(err);
      }
    } else {
      this.formMessage = 'Form is invalid';
    }
  }

  async onCheckoutBook(): Promise<void> {
    if (this.checkOutBookForm.valid) {
      this.checkOutBookForm.patchValue({ issuer: this.issuer });
      try {
        const response = await this.booksService.rentBook(
          this.checkOutBookForm.value
        );
        if (response.data.error) {
          this.formMessage = response.data.error.message;
        } else {
          this.formMessage = response.data.message;
          this.refresh();
        }
      } catch (err) {
        this.formMessage = this.getErrorMessage(err);
      }
    } else {
      this.formMessage = 'Form is invalid';
      console.log('Form is invalid');
    }
  }

  async onReturnBook(): Promise<void> {
    if (this.returnBookForm.valid) {
      console.log(this.returnBookForm.value);
      try {
        const response = await this.booksService.returnBook(
          this.returnBookForm.value
        );
        if (response.data.error) {
          this.formMessage = response.data.error.message;
        } else {
          this.refresh();
          this.formMessage = response.data.message;
        }
      } catch (err) {
        this.formMessage = this.getErrorMessage(err);
      }
    } else {
      this.formMessage = 'Form is invalid';
      console.log('Form is invalid');
    }
  }

  showLogoutModal(event: Event): void {
    event.preventDefault();
    const logoutModal = document.getElementById(
      'logoutModal'
    ) as HTMLDialogElement;
    if (logoutModal) {
      logoutModal.showModal();
    }
  }

  closeLogoutModal(): void {
    const logoutModal = document.getElementById(
      'logoutModal'
    ) as HTMLDialogElement;
    if (logoutModal) {
      logoutModal.close();
    }
  }

  confirmLogout(): void {
    this.userService.logoutUser();
    this.router.navigate(['/login']);
    this.closeLogoutModal();
  }

  private getErrorMessage(err: any): string {
    if (err.response && err.response.data && err.response.data.message) {
      return `Server-side error: ${err.response.status} ${err.response.data.message}`;
    } else {
      return `Client-side error: ${err.message}`;
    }
  }
}
