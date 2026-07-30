import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { uiText } from '@core/i18n/ui-text';
import { TranslateService } from '@core/services/translate.service';
import { Course } from '@shared/interfaces/course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent {
  protected readonly translate = inject(TranslateService);

  readonly courseList = input<readonly Course[]>([]);

  titleLabel(): string {
    return this.translate.text(uiText.portfolio.sections.courses);
  }

  emptyMessage(): string {
    return this.translate.text(uiText.portfolio.emptyRecords);
  }

  viewCertificateLabel(): string {
    return this.translate.text(uiText.portfolio.course.viewCertificate);
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
