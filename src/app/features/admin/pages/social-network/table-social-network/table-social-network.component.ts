import { FrmSocialNetworkComponent } from '@features/admin/pages/social-network/frm-social-network/frm-social-network.component';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { finalize } from 'rxjs';
import { Column } from '@shared/components/interfaces/column';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-table-social-network',
  templateUrl: './table-social-network.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
})
export class TableSocialNetworkComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private socialNetworkService = inject(SocialNetworkService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly records = signal<readonly SocialNetwork[]>([]);

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Name', value: 'name' },
    { name: 'Icon', value: 'icon' },
    { name: 'Color', value: 'color' },
    { name: 'Url', value: 'url' },
  ];

  ngOnInit(): void {
    this.getSocialNetworkListByDeleted();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getSocialNetworkListByDeleted(): void {
    this.spinner.show();
    this.socialNetworkService
      .getSocialNetworkListByDeleted()
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

  modalSocialNetwork(socialNetwork?: SocialNetwork): void {
    const dialogRef = this.parameter.openDialog(FrmSocialNetworkComponent, {
      positions: this.records().length + 5,
      socialNetwork: socialNetwork,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) this.getSocialNetworkListByDeleted();
        },
      });
  }

  confirmDelete(socialNetwork: SocialNetwork): void {
    this.alert.confirmDelete(() => this.deleteSocialNetwork(socialNetwork));
  }

  deleteSocialNetwork(socialNetwork: SocialNetwork): void {
    this.spinner.show();
    this.socialNetworkService
      .deleteSocialNetwork(socialNetwork.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getSocialNetworkListByDeleted();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
