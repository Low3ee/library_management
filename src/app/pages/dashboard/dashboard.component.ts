import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { JwtService } from '../../service/JwtService';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../repository/user/user.service';
import { BooksService } from '../../repository/books/books.service';

interface Balance {
  balance: number;
}

interface UserDeets {
  id: any;
  name: any;
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
  imports: [SidenavComponent, PopupComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
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
    this.getBalance();
    this.getUserRentedBooks();
    this.getNotReturnedRentedBooks();
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
        // Ensure that 'data' is typed as 'Balance'
        console.log(`data: ${data.balance}`);
        // Format the balance using the 'balance' field from 'data'
        const amount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'PHP',
        }).format(data.balance);

        // Assign the formatted balance to 'this.balance'
        this.balance = amount;
        console.log(`Formatted balance: ${this.balance}`);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getDeets() {
    let jwt = this.jwtService;
    const deets: UserDeets = {
      id: jwt.getUserId(),
      name: jwt.getName(),
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
