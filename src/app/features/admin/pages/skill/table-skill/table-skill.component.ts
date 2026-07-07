import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrmSkillComponent } from '@features/admin/pages/skill/frm-skill/frm-skill.component';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { AlertService } from '@core/services/alert.service';
import { SkillService } from '@features/admin/services/skill.service';
import { finalize } from 'rxjs';
import { Column } from '@shared/components/interfaces/column';
import { Skill } from '@shared/interfaces/skill';
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
  imports: [TableComponent],
})
export class TableSkillComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private skillService = inject(SkillService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly records = signal<readonly Skill[]>([]);

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Skill', value: 'name' },
    { name: 'Picture', value: 'picture', image: true },
  ];

  ngOnInit(): void {
    this.getSkillListByDeleted();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getSkillListByDeleted(): void {
    this.spinner.show();
    this.skillService
      .getSkillListByDeleted()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => this.records.set(result.data),
        error: (error) => {
          this.records.set([]);
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
          if (result) this.getSkillListByDeleted();
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
          this.getSkillListByDeleted();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
