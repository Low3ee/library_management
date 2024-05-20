import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { BooksService } from '../../repository/books/books.service';
import { JwtService } from '../../service/JwtService';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SidenavComponent, NgFor, NgClass, NgIf],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  constructor(
    private booksService: BooksService,
    private jwtService: JwtService
  ) {}

  books: any = [];
  username: string = 'hello world';

  compareDate(dateC: any) {
    let timestamp = Date.now();
    let currentDate = new Date(timestamp);
    let targetDate = new Date(dateC);
    return currentDate > targetDate;
  }

  ngOnInit(): void {
    this.username = this.jwtService.getName();
    this.getUserRentedBooks();
    initFlowbite();
  }

  async getUserRentedBooks(): Promise<void> {
    try {
      const response = await this.booksService.getUserRentedBooks(
        this.jwtService.getUserId()
      );
      this.books = response.data.data;
      console.log(this.books);
    } catch (error) {
      console.error('Error fetching rented books:', error);
    }
  }
}
