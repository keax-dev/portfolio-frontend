import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrmSkillComponent } from '../frm-skill/frm-skill.component';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AlertService } from '@app/shared/services/alert.service';
import { SkillService } from '@app/home/services/skill.service';
import { Column } from '@app/components/interfaces/column';
import { Skill } from '@app/home/interfaces/skill';

@Component({
  selector: 'app-table-skill',
  templateUrl: './table-skill.component.html',
  standalone: false
})
export class TableSkillComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private skillService = inject(SkillService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  records: Skill[] = [];

  columns: Column[] = [
    { name: "Position", value: "position" },
    { name: "Skill", value: "name" },
    { name: "Picture", value: "picture", image: true }
  ];

  ngOnInit(): void {
    this.getSkillListByDeleted();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getSkillListByDeleted(): void {
    this.spinner.show();
    this.skillService.getSkillListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.records = result.data;
          return;
        }

        this.records = [];
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  modalSkill(skill?: Skill): void {
    const dialogRef = this.parameter.openDialog(FrmSkillComponent, {
      positions: this.records.length + 5,
      skill: skill
    });
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getSkillListByDeleted();
      }
    });
  }

  confirmDelete(skill: Skill): void {
    this.alert.confirmDelete(() => this.deleteSkill(skill));
  }

  deleteSkill(skill: Skill): void {
    this.spinner.show();
    this.skillService.deleteSkill(skill.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.getSkillListByDeleted();
          return;
        }

        this.alert.resultWarnings(result);
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

}
