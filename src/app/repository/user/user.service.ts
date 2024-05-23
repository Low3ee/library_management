import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from '../../service/JwtService';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient, private jwtService: JwtService) {}

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'An error occurred';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error: ${err.error.message}`;
    } else {
      errorMessage = `${err.error.message}`;
    }
    return throwError(() => errorMessage);
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const token = this.jwtService.getToken();
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  registerUser(user: any): Observable<any> {
    return this.httpClient
      .post('http://localhost:4201/api/user/signup', JSON.stringify(user), {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  loginUser(user: {}): Observable<any> {
    return this.httpClient
      .post('http://localhost:4201/api/user/login', JSON.stringify(user), {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  validateAdminSession(user: {}): Observable<any> {
    return this.httpClient
      .post(
        'http://localhost:4201/api/user/validateAdminSession',
        JSON.stringify(user),
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getUserBalance(userId: any): Observable<any> {
    return this.httpClient
      .get(`http://localhost:4201/api/user/getBalance/${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.replace('/signin');
  }

  deleteUser(userId: any): Observable<any> {
    return this.httpClient
      .delete(`http://localhost:4201/api/user/delete/${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<any> {
    return this.httpClient
      .get('http://localhost:4201/api/user/all', {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getUsersByIds(userIds: any[]): Observable<any> {
    const params = { userIds: userIds.join(',') };
    return this.httpClient
      .get('http://localhost:4201/api/user/getUsersByIds', {
        params,
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  editUser(userId: any, updatedUser: any): Observable<any> {
    return this.httpClient
      .patch(`http://localhost:4201/api/user/edit/${userId}`, updatedUser, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
