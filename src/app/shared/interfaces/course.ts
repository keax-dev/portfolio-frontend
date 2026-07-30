import type { CourseDto } from '@shared/api/generated';

export type Course = Readonly<
  Required<Pick<CourseDto, 'id' | 'name' | 'name_en' | 'position' | 'institution'>> &
    Pick<
      CourseDto,
      'certificate_img' | 'certificate_url' | 'deleted' | 'institution_name' | 'institution_name_es'
    >
>;

export type CoursePayload = Readonly<
  Required<Pick<CourseDto, 'name' | 'name_en' | 'position' | 'institution'>> &
    Pick<CourseDto, 'certificate_url'>
>;
