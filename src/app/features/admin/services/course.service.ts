import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Course, CoursePayload } from '@shared/interfaces/course';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly reference = '/course';
  private readonly baseUrl = environment.url;
  private readonly http = inject(HttpClient);

  getCourseList(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.baseUrl}${this.reference}`);
  }

  createCourse(payload: CoursePayload): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(`${this.baseUrl}${this.reference}`, payload);
  }

  updateCourse(courseId: number, payload: CoursePayload): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(
      `${this.baseUrl}${this.reference}/${courseId}`,
      payload,
    );
  }

  deleteCourse(courseId: number): Observable<ApiResponse<Course[]>> {
    return this.http.delete<ApiResponse<Course[]>>(`${this.baseUrl}${this.reference}/${courseId}`);
  }
}
