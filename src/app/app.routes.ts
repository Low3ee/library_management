import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WildcardComponent } from './pages/wildcard/wildcard.component';
import { HistoryComponent } from './pages/history/history.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { BooksComponent } from './pages/admin/books/books.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'ACLC Library | Dashboard',
  },
  {
    path: 'signin',
    component: SigninComponent,
    title: 'ACLC Library | Signin',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'ACLC Library | Signup',
  },
  {
    path: 'history',
    component: HistoryComponent,
    title: 'ACLC Library | Borrow History',
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    title: 'ACLC Library | Librarian Dashboard',
  },
  {
    path: 'admin/books',
    component: BooksComponent,
    title: 'ACLC Library | Books',
  },
  {
    path: '**',
    component: WildcardComponent,
    title: 'ACLC Library | 404 Not Found',
  },
];
