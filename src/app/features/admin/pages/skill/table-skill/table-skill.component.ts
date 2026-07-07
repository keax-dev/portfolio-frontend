import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrmSkillComponent } from '@features/admin/pages/skill/frm-skill/frm-skill.component';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AlertService } from '@core/services/alert.service';
import { SkillService } from '@features/admin/services/skill.service';
import { finalize } from 'rxjs';
import { Column } from '@shared/components/interfaces/column';
import { Skill } from '@shared/interfaces/skill';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-table-skill',
  templateUrl: './table-skill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableSkillComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private skillService = inject(SkillService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly pageCopy = adminTableCopy.skill;
  readonly records = signal<readonly Skill[]>([]);
  readonly isLoading = signal(false);
  readonly loadErrorMessage = signal('');

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Skill', value: 'name' },
    { name: 'Picture', value: 'picture', image: true },
  ];

  ngOnInit(): void {
    this.getSkillList();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getSkillList(): void {
    this.isLoading.set(true);
    this.loadErrorMessage.set('');
    this.skillService
      .getSkillList()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.records.set(result.data);
          this.loadErrorMessage.set('');
        },
        error: (error) => {
          this.records.set([]);
          this.loadErrorMessage.set(ADMIN_TABLE_LOAD_ERROR_MESSAGE);
          this.alert.httpError(error);
        },
      });
  }

  modalSkill(skill?: Skill): void {
    const dialogRef = this.parameter.openDialog(FrmSkillComponent, {
      positions: this.records().length + 5,
      skill: skill,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            this.getSkillList();
          }
        },
      });
  }

  confirmDelete(skill: Skill): void {
    this.alert.confirmDelete(() => this.deleteSkill(skill));
  }

  deleteSkill(skill: Skill): void {
    this.spinner.show();
    this.skillService
      .deleteSkill(skill.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getSkillList();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
