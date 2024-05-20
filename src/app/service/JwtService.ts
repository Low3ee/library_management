import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  getUserId(): string | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.userId;
    }
    return null;
  }

  getUsername(): string | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.username;
    }
    return null;
  }
  getName() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.name;
    }
    return null;
  }
  getCourse() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.course;
    }
    return null;
  }

  getYearLevel() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.year_level;
    }
    return null;
  }
  getContactNo() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.contact_no;
    }
    return null;
  }

  getBalance() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const amount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(decodedToken.balance);
      return amount;
    }
    return null;
  }
  getDateEnrolled() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      let sqlDate = decodedToken.date_enrolled;
      let date = new Date(sqlDate).toLocaleDateString();

      return date;
    }
    return null;
  }

  getRole() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.role;
    }
  }

  getEmail() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken.email;
    }
  }
}
