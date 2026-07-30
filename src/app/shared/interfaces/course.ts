export interface Course {
  readonly id: number;
  readonly name: string;
  readonly name_en: string;
  readonly certificate_img?: string;
  readonly certificate_url?: string;
  readonly position: number;
  readonly deleted?: boolean;
  readonly institution: number;
  readonly institution_name?: string;
  readonly institution_name_es?: string;
}

export type CoursePayload = Readonly<
  Pick<Course, 'name' | 'name_en' | 'certificate_url' | 'position' | 'institution'>
>;
