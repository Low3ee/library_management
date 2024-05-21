import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../repository/user/user.service';
import { BooksService } from '../../../repository/books/books.service';
import { HistoryResponse } from '../../../models/bookHistory/bookHistory';
import { AxiosResponse } from 'axios';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Borrower {
  id: any;
  name: string;
  contact: string;
}

interface BorrowedBook {
  returned: any;
  id: any;
  user_id: number;
  bookId: number;
  remarks: string;
  fine: any;
  sname: string;
  contact: string;
  bookName: string;
  borrower: Borrower | null;
}

interface BorrowedBooksResponse {
  message: string;
  borrowedBooks: BorrowedBook[];
}

@Component({
  selector: 'app-borrowlist',
  standalone: true,
  imports: [NgForOf, RouterLink],
  templateUrl: './borrowlist.component.html',
  styleUrls: ['./borrowlist.component.css'],
})
export class BorrowlistComponent implements OnInit {
  rentedBooks: BorrowedBook[] = [];
  constructor(
    private booksService: BooksService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadRentedBooks();
  }

  loadRentedBooks(): void {
    this.booksService
      .getAllRentedBooks()
      .then((response: AxiosResponse<BorrowedBooksResponse>) => {
        console.log('Rented books response:', response.data);
        this.rentedBooks = response.data.borrowedBooks;
        this.loadBorrowerInformation();
      })
      .catch((error: any) => {
        console.error('Error loading rented books:', error);
      });
  }

  loadBorrowerInformation(): void {
    const userIds = this.rentedBooks.map((book) => book.user_id);
    this.userService.getUsersByIds(userIds).subscribe(
      (data: any) => {
        const users = data.reduce((acc: any, user: any) => {
          acc[user.id] = user;
          return acc;
        }, {});
        this.rentedBooks.forEach((book) => {
          book.borrower = users[book.user_id];
        });
      },
      (error: any) => {
        console.error('Error loading users:', error);
      }
    );
  }

  returnBook(bookId: number, userId: number): void {
    const promptMessage = prompt('Enter remarks (optional):');
    const penaltyInput = prompt('Enter penalty amount:');
    if (penaltyInput === null) return; // Check if penalty input is null
    const penalty = parseFloat(penaltyInput);
    if (isNaN(penalty) || penalty < 0) {
      alert('Invalid penalty amount. Please enter a valid number.');
      return;
    }
    const confirmation = confirm('Are you sure you want to return this book?');
    if (confirmation) {
      this.booksService
        .returnBook({
          checkoutId: bookId,
          studentId: userId,
          penalty,
          remarks: promptMessage,
        })
        .then((response: AxiosResponse<any>) => {
          console.log('Book returned successfully:', response.data);
          this.loadRentedBooks();
        })
        .catch((error: any) => {
          console.error('Error returning book:', error);
        });
    }
  }
}
