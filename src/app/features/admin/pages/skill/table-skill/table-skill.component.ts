import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrmSkillComponent } from '../frm-skill/frm-skill.component';
import { ParameterService } from '@core/services/parameter.service';
import { AlertService } from '@core/services/alert.service';
import { SkillService } from '@features/admin/services/skill.service';
import { Column } from '@shared/components/interfaces/column';
import { Skill } from '@shared/models/skill';

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
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.alert.httpError(error);
      }
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
        this.alert.success(result.alert);
        this.getSkillListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
