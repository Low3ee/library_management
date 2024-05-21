import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'An error occurred';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error: ${err.error.message}`;
    } else {
      errorMessage = `${err.error.message}`;
    }
    return throwError(() => errorMessage);
  }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  registerUser(user: any): Observable<any> {
    return this.httpClient
      .post('http://localhost:4201/api/user/signup', JSON.stringify(user), {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  loginUser(user: {}): Observable<any> {
    return this.httpClient
      .post('http://localhost:4201/api/user/login', JSON.stringify(user), {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  validateAdminSession(user: {}): Observable<any> {
    return this.httpClient
      .post(
        'http://localhost:4201/api/user/validateAdminSession',
        JSON.stringify(user),
        {
          headers: this.headers,
        }
      )
      .pipe(catchError(this.handleError));
  }

  getUserBalance(userId: any): Observable<any> {
    return this.httpClient
      .get(`http://localhost:4201/api/user/getBalance/${userId}`)
      .pipe(catchError(this.handleError));
  }

  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.replace('/signin');
  }

  deleteUser(userId: any): Observable<any> {
    return this.httpClient
      .delete(`http://localhost:4201/api/user/delete/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<any> {
    return this.httpClient
      .get('http://localhost:4201/api/user/all')
      .pipe(catchError(this.handleError));
  }

  getUsersByIds(userIds: any[]): Observable<any> {
    const params = { userIds: userIds.join(',') };
    return this.httpClient
      .get('http://localhost:4201/api/user/getUsersByIds', { params })
      .pipe(catchError(this.handleError));
  }
}
