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
import { FrmSocialNetworkComponent } from '@features/admin/pages/social-network/frm-social-network/frm-social-network.component';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { SocialNetwork } from '@shared/interfaces/social-network';

@Component({
  selector: 'app-table-social-network',
  templateUrl: './table-social-network.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableSocialNetworkComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly socialNetworkService = inject(SocialNetworkService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<SocialNetwork>({
    destroyRef: this.destroyRef,
    load: () => this.socialNetworkService.getSocialNetworkList(),
    remove: (id) => this.socialNetworkService.deleteSocialNetwork(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.socialNetwork;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<SocialNetwork>[] = [
    { name: 'Position', value: 'position' },
    { name: 'Name', value: 'name' },
    { name: 'Icon', value: 'icon' },
    { name: 'Color', value: 'color' },
    { name: 'Url', value: 'url' },
  ];

  ngOnInit(): void {
    this.getSocialNetworkList();
  }

  getSocialNetworkList(): void {
    this.state.load();
  }

  modalSocialNetwork(socialNetwork?: SocialNetwork): void {
    this.dialogs
      .open(FrmSocialNetworkComponent, {
        data: { positions: this.records().length + ADMIN_POSITION_BUFFER, socialNetwork },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getSocialNetworkList());
  }

  confirmDelete(socialNetwork: SocialNetwork): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteSocialNetwork(socialNetwork));
  }

  deleteSocialNetwork(socialNetwork: SocialNetwork): void {
    this.state.remove(socialNetwork.id);
  }
}
