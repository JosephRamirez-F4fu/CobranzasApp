import { inject, Injectable, signal } from '@angular/core';
import { Student } from '@domain/interface/student';
import { ApiService } from '@shared/api/api.service';
import { tap } from 'rxjs';

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class StundentsService {
  api = inject(ApiService);
  students = signal<PageResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  selectedStudent = signal<Student | null>(null);
  domain = 'students';

  addStudent(student: Student) {
    return this.api.post<Student, Student>(`${this.domain}`, student).pipe(
      tap((newStudent) => {
        if (this.students().data.length < this.students().pageSize) {
          this.students.set({
            ...this.students(),
            data: [...this.students().data, newStudent.data],
            total: this.students().total + 1,
          });
          return;
        }
        this.students.set({
          ...this.students(),
          data: [...this.students().data, newStudent.data].slice(1),
          total: this.students().total + 1,
        });
      })
    );
  }
  updateStudent(student: Student, id: number) {
    return this.api.put<Student, Student>(`${this.domain}/${id}`, student);
  }
  deleteStudent(id: number) {
    return this.api.delete(`${this.domain}/${id}`);
  }
  loadStudents() {
    return this.api.get<PageResult<Student>>(`${this.domain}`);
  }
  selectStudent(id: number) {
    const student = this.students().data.find((s) => s.id === id) || null;
    this.selectedStudent.set(student);
  }
  clearSelectedStudent() {
    this.selectedStudent.set(null);
  }
  pageStudents(page: number, pageSize: number) {
    this.students.set({
      ...this.students(),
      page,
      pageSize,
    });
    return this.api.get<PageResult<Student>>(
      `${this.domain}?page=${page}&pageSize=${pageSize}`
    );
  }
}
