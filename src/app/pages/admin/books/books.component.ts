import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../service/JwtService';
import { BooksService } from '../../../repository/books/books.service';
import { BookModel } from '../../../models/book/book';
import { NgClass, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [NgFor, NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class BooksComponent implements OnInit {
  books: BookModel[] = []; // Assuming BookModel defines the structure of a book
  editBookForm: FormGroup;
  currentBook: BookModel | null = null;

  constructor(
    private bookService: BooksService,
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize the form group inside the constructor
    this.editBookForm = this.fb.group({
      id: [''],
      name: [''],
      author: [''],
      category: [''],
    });
  }

  ngOnInit(): void {
    if (this.jwtService.getToken()) {
      if (this.jwtService.getRole() == 1) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/signin']);
    }
    this.bookService
      .getBooks()
      .then((response) => {
        this.books = response.data.books;
        console.log(this.books);
      })
      .catch((error) => {
        console.error('There was an error fetching the books!', error);
      });
  }

  openEditDialog(book: BookModel): void {
    this.currentBook = book;
    this.editBookForm.patchValue(book);
    const dialog: any = document.getElementById('editBook');
    dialog.showModal();
  }

  closeEditDialog(): void {
    const dialog: any = document.getElementById('editBook');
    dialog.close();
  }

  onSubmit(): void {
    if (this.currentBook) {
      const updatedBook = this.editBookForm.value;
      from(
        this.bookService.editBook(this.currentBook.id, updatedBook)
      ).subscribe(
        (response) => {
          console.log('Book updated successfully', response);
          // Update the local book list if necessary
          const index = this.books.findIndex(
            (b) => b.id === this.currentBook?.id
          );
          if (index !== -1) {
            this.books[index] = { ...this.currentBook, ...updatedBook };
          }
          this.closeEditDialog();
        },
        (error) => {
          console.error('Error updating book', error);
        }
      );
    }
  }

  onDelete(): void {
    if (this.currentBook) {
      const confirmation = confirm(
        `Are you sure you want to delete the book "${this.currentBook.name}"?`
      );
      if (confirmation) {
        from(this.bookService.deleteBook(this.currentBook.id)).subscribe(
          (response) => {
            console.log('Book deleted successfully', response);
            // Remove the deleted book from the local book list
            this.books = this.books.filter(
              (b) => b.id !== this.currentBook?.id
            );
            this.closeEditDialog();
          },
          (error) => {
            console.error('Error deleting book', error);
          }
        );
      }
    }
  }
}
