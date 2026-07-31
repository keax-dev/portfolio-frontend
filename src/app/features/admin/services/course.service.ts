import { HttpClient } from '@angular/common/http';
import { CrudResourceClient } from '@core/http/crud-resource-client';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Course, CoursePayload } from '@shared/interfaces/course';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly resource = new CrudResourceClient<Course, CoursePayload>(
    inject(HttpClient),
    `${environment.url}/course`,
  );

  getCourseList(): Observable<ApiResponse<Course[]>> {
    return this.resource.list();
  }

  createCourse(payload: CoursePayload): Observable<ApiResponse<Course>> {
    return this.resource.create(payload);
  }

  updateCourse(courseId: number, payload: CoursePayload): Observable<ApiResponse<Course>> {
    return this.resource.update(courseId, payload);
  }

  deleteCourse(courseId: number): Observable<ApiResponse<Course[]>> {
    return this.resource.remove(courseId);
  }
}
