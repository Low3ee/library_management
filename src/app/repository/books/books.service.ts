import axios, { AxiosRequestConfig } from 'axios';
import { BookModel } from '../../models/book/book';
import { HistoryResponse } from '../../models/bookHistory/bookHistory';
import { Injectable } from '@angular/core';
import { JwtService } from '../../service/JwtService';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private baseURL = 'http://localhost:4201/api';

  constructor(private jwtService: JwtService) {}

  private getHeaders(): AxiosRequestConfig {
    const headers: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const token = this.jwtService.getToken();
    if (token) {
      if (!headers.headers) {
        headers.headers = {};
      }
      headers.headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  getBooks() {
    return axios.get(`${this.baseURL}/books/getBooks`, this.getHeaders());
  }

  registerBook(newBook: BookModel) {
    return axios.post(`${this.baseURL}/books/add`, newBook, this.getHeaders());
  }

  editBook(bookId: any, book: BookModel) {
    return axios.patch(
      `${this.baseURL}/books/edit/${bookId}`,
      book,
      this.getHeaders()
    );
  }

  deleteBook(bookId: any) {
    return axios.delete(
      `${this.baseURL}/books/delete/${bookId}`,
      this.getHeaders()
    );
  }

  getAllRentedBooks() {
    return axios.get(`${this.baseURL}/rents/rented`, this.getHeaders());
  }

  getUserRentedBooks(userId: any) {
    return axios.get<HistoryResponse>(
      `${this.baseURL}/rents/rented/${userId}`,
      this.getHeaders()
    );
  }

  getUserReturnedBooks(userId: any) {
    return axios.get(
      `${this.baseURL}/rents/rented/${userId}`,
      this.getHeaders()
    );
  }

  getUserNotReturnedBooks(userId: any) {
    return axios.get(
      `${this.baseURL}/rents/not-returned/${userId}`,
      this.getHeaders()
    );
  }

  rentBook(data: any) {
    return axios.post(`${this.baseURL}/rents/rent`, data, this.getHeaders());
  }

  returnBook(data: any) {
    return axios.patch(`${this.baseURL}/rents/return`, data, this.getHeaders());
  }
}
