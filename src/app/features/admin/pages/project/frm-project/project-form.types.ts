import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ProjectLinkType } from '@shared/interfaces/project';

export type ProjectTechnologyFormGroup = FormGroup<{
  relation_id: FormControl<number | null>;
  id: FormControl<number>;
  position: FormControl<number>;
}>;

export type ProjectLinkFormGroup = FormGroup<{
  id: FormControl<number | null>;
  type: FormControl<ProjectLinkType>;
  url: FormControl<string>;
  position: FormControl<number>;
}>;

export type ProjectTechnologyFormArray = FormArray<ProjectTechnologyFormGroup>;
export type ProjectLinkFormArray = FormArray<ProjectLinkFormGroup>;
