import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { JwtService } from '../../service/JwtService';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../repository/user/user.service';
import { BooksService } from '../../repository/books/books.service';
import { EditInfoModalComponent } from '../../components/edit-info-modal/edit-info-modal.component';
import { NgIf } from '@angular/common';

interface Balance {
  balance: number;
}

interface UserDeets {
  id: any;
  name: any;
  username: any;
  email: any;
  course: any;
  year_level: any;
  balance: any;
  contact: any;
  date_enrolled: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    PopupComponent,
    RouterLink,
    EditInfoModalComponent,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isModalOpen = false;
  userDetails: any;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private router: Router,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    if (this.jwtService.getToken() == null) {
      this.router.navigate(['/signin']);
    }
    if (this.jwtService.getRole() !== 1) {
      this.router.navigate(['/admin']);
    }
    this.getBalance();
    this.getUserRentedBooks();
    this.getNotReturnedRentedBooks();
    this.userDetails = this.getDeets();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUserDetails(updatedDetails: UserDeets) {
    this.userService.editUser(updatedDetails.id, updatedDetails).subscribe({
      next: (res) => {
        this.userDetails = { ...updatedDetails };
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  balance: any = 0;
  bookCount: any = 0;
  notReturned: any = 0;
  books: any = [];

  logOut() {
    return this.userService.logoutUser();
  }

  async getUserRentedBooks(): Promise<void> {
    try {
      const response = await this.booksService.getUserRentedBooks(
        this.jwtService.getUserId()
      );
      this.books = response.data.data;
      this.bookCount = this.books.length;
    } catch (error) {
      console.error('Error fetching rented books:', error);
    }
  }

  async getNotReturnedRentedBooks(): Promise<void> {
    try {
      const response = await this.booksService.getUserNotReturnedBooks(
        this.jwtService.getUserId()
      );
      let data = response.data.data;
      this.notReturned = data.count;
    } catch (error) {
      console.error('Error fetching not returned books:', error);
    }
  }

  getBalance() {
    this.userService.getUserBalance(this.jwtService.getUserId()).subscribe({
      next: (data: Balance) => {
        const amount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(data.balance);
        this.balance = amount;
        console.log(`balance: ${this.balance}`);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getDeets(): UserDeets {
    const jwt = this.jwtService;
    const deets: UserDeets = {
      id: jwt.getUserId(),
      name: jwt.getName(),
      username: jwt.getUsername(),
      email: jwt.getEmail(),
      course: jwt.getCourse(),
      year_level: jwt.getYearLevel(),
      balance: this.balance,
      contact: jwt.getContactNo(),
      date_enrolled: jwt.getDateEnrolled(),
    };
    return deets;
  }
}
