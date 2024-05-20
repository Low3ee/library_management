import axios, { AxiosRequestConfig } from 'axios';
import { BookModel } from '../../models/book/book';
import { HistoryResponse } from '../../models/bookHistory/bookHistory';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private baseURL = 'http://localhost:4201/api';

  constructor() {}

  getBooks() {
    return axios.get(`${this.baseURL}/books/getBooks`);
  }

  registerBook(newBook: BookModel) {
    return axios.post(`${this.baseURL}/books/add`, newBook);
  }

  editBook(bookId: any, book: BookModel) {
    return axios.patch(`${this.baseURL}/books/edit/${bookId}`, book);
  }

  deleteBook(bookId: any) {
    return axios.delete(`${this.baseURL}/books/delete/${bookId}`);
  }

  getAllRentedBooks() {
    return axios.get(`${this.baseURL}/rents/rented`);
  }

  getUserRentedBooks(userId: any) {
    return axios.get<HistoryResponse>(`${this.baseURL}/rents/rented/${userId}`);
  }

  getUserReturnedBooks(userId: any) {
    return axios.get(`${this.baseURL}/rents/rented/${userId}`);
  }

  getUserNotReturnedBooks(userId: any) {
    return axios.get(`${this.baseURL}/rents/not-returned/${userId}`);
  }

  rentBook(data: any) {
    return axios.post(`${this.baseURL}/rents/rent`, data);
  }

  returnBook(data: any) {
    return axios.patch(`${this.baseURL}/rents/return`, data);
  }
}
