import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_POSITION_BUFFER,
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmSkillComponent } from '@features/admin/pages/skill/frm-skill/frm-skill.component';
import { SkillService } from '@features/admin/services/skill.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Skill } from '@shared/interfaces/skill';

@Component({
  selector: 'app-table-skill',
  templateUrl: './table-skill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableSkillComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly skillService = inject(SkillService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Skill>({
    destroyRef: this.destroyRef,
    load: () => this.skillService.getSkillList(),
    remove: (id) => this.skillService.deleteSkill(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.skill;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<Skill>[] = [
    { name: 'Position', value: 'position' },
    { name: 'Skill', value: 'name' },
    { name: 'Picture', value: 'picture', image: true, imageAlt: (record) => record.name },
  ];

  ngOnInit(): void {
    this.getSkillList();
  }

  getSkillList(): void {
    this.state.load();
  }

  modalSkill(skill?: Skill): void {
    this.dialogs
      .open(FrmSkillComponent, {
        data: { positions: this.records().length + ADMIN_POSITION_BUFFER, skill },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getSkillList());
  }

  confirmDelete(skill: Skill): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteSkill(skill));
  }

  deleteSkill(skill: Skill): void {
    this.state.remove(skill.id);
  }
}
