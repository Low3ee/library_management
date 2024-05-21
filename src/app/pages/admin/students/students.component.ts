import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../repository/user/user.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink],
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStudents();
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
    // Implement edit functionality here
    console.log('Editing student:', student);
    // You can open a dialog or navigate to an edit page
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
