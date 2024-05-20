import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../../repository/books/books.service';
import { BookModel } from '../../../models/book/book';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [NgFor],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  constructor(
    private bookService: BooksService,
    private httpClient: HttpClient
  ) {}
  ngOnInit(): void {
    this.httpClient.get('assets/tempBookData').subscribe({
      next: (data) => {
        this.books.push(data);
      },
    });
  }
}
