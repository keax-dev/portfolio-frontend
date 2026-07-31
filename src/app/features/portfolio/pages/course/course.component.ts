import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { uiText } from '@core/i18n/ui-text';
import { TranslateService } from '@core/services/translate.service';
import { Course } from '@shared/interfaces/course';

const COURSE_BATCH_SIZE = 3;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent {
  protected readonly translate = inject(TranslateService);
  protected readonly courseBatchSize = COURSE_BATCH_SIZE;
  private readonly visibleCourseCount = signal(COURSE_BATCH_SIZE);

  readonly courseList = input<readonly Course[]>([]);
  protected readonly visibleCourses = computed(() =>
    this.courseList().slice(0, this.visibleCourseCount()),
  );
  protected readonly hasMoreCourses = computed(
    () => this.visibleCourseCount() < this.courseList().length,
  );

  titleLabel(): string {
    return this.translate.text(uiText.portfolio.sections.courses);
  }

  emptyMessage(): string {
    return this.translate.text(uiText.portfolio.emptyRecords);
  }

  viewCertificateLabel(): string {
    return this.translate.text(uiText.portfolio.course.viewCertificate);
  }

  viewMoreLabel(): string {
    return this.translate.text(uiText.portfolio.course.viewMore);
  }

  showMoreCourses(): void {
    this.visibleCourseCount.update((currentCount) =>
      Math.min(currentCount + COURSE_BATCH_SIZE, this.courseList().length),
    );
  }

  certificateAlt(course: Course): string {
    return `${this.translate.text(uiText.portfolio.course.certificateFor)} ${this.courseName(course)}`;
  }

  courseName(course: Course): string {
    return this.translate.getLang === 'es' ? course.name : course.name_en;
  }

  certificateHref(course: Course): string {
    return course.certificate_url || course.certificate_img || '';
  }

  institutionName(course: Course): string {
    if (this.translate.getLang === 'es') {
      return course.institution_name_es || course.institution_name || '';
    }
    return course.institution_name || course.institution_name_es || '';
  }
}
