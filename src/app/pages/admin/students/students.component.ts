import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../repository/user/user.service';
import { JwtService } from '../../../service/JwtService';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { EditInfoModalComponent } from '../../../components/edit-info-modal/edit-info-modal.component';
import { EditBalanceModalComponent } from '../../../components/edit-balance-modal/edit-balance-modal.component';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    EditInfoModalComponent,
    EditBalanceModalComponent,
    RouterLink,
  ],
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  editedStudent: any = null;
  studentForBalanceEdit: any = null;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    if (this.jwtService.getToken()) {
      if (this.jwtService.getRole() == 1) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/signin']);
    }
  }

  loadStudents(): void {
    this.userService.getAll().subscribe(
      (data: any) => {
        this.students = data;
      },
      (error: any) => {
        console.error('Error loading students:', error);
      }
    );
  }

  editStudent(student: any): void {
    this.editedStudent = { ...student };
  }

  saveStudentChanges(updatedStudent: any): void {
    // Handle saving changes to the student
    console.log('Saving changes:', updatedStudent);
    // Update the student using the userService
    this.userService.editUser(updatedStudent.id, updatedStudent).subscribe({
      next: (res) => {
        // Update the student in the students array
        const index = this.students.findIndex(
          (student) => student.id === updatedStudent.id
        );
        if (index !== -1) {
          this.students[index] = updatedStudent;
        }
      },
      error: (err) => {
        console.error('Error updating student:', err);
      },
    });
    // Close the dialog
    this.closeEditDialog();
  }

  closeEditDialog(): void {
    // Close the dialog by resetting the edited student
    this.editedStudent = null;
  }

  editBalance(student: any): void {
    this.studentForBalanceEdit = { ...student };
  }

  saveBalanceChanges(updatedBalance: any): void {
    console.log('Saving balance changes:', updatedBalance);

    // Find the complete student object
    const student = this.students.find((s) => s.id === updatedBalance.id);

    // Create a complete student object with the updated balance
    const updatedStudent = { ...student, balance: updatedBalance.balance };

    // Update the student using the userService
    this.userService.editUser(updatedBalance.id, updatedStudent).subscribe({
      next: (res) => {
        // Update the student balance in the students array
        const index = this.students.findIndex(
          (student) => student.id === updatedBalance.id
        );
        if (index !== -1) {
          this.students[index].balance = updatedBalance.balance;
        }
      },
      error: (err) => {
        console.error('Error updating balance:', err);
      },
    });
    // Close the dialog
    this.closeBalanceDialog();
  }

  closeBalanceDialog(): void {
    this.studentForBalanceEdit = null;
  }

  deleteStudent(studentId: any): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.userService.deleteUser(studentId).subscribe(
        () => {
          console.log('Student deleted successfully.');
          // Reload students after deletion
          this.loadStudents();
        },
        (error: any) => {
          console.error('Error deleting student:', error);
        }
      );
    }
  }
}
