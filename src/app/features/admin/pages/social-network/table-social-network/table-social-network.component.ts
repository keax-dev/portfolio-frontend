import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmSocialNetworkComponent } from '../frm-social-network/frm-social-network.component';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { SocialNetwork } from '@shared/models/social-network';
import { AlertService } from '@core/services/alert.service';
import { Column } from '@shared/components/interfaces/column';

@Component({
  selector: 'app-table-social-network',
  templateUrl: './table-social-network.component.html',
  standalone: false
})
export class TableSocialNetworkComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private socialNetworkService = inject(SocialNetworkService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  records: SocialNetwork[] = [];

  columns: Column[] = [
    { name: "Position", value: "position" },
    { name: "Name", value: "name" },
    { name: "Icon", value: "icon" },
    { name: "Color", value: "color" },
    { name: "Url", value: "url" }
  ];

  ngOnInit(): void {
    this.getSocialNetworkListByDeleted();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getSocialNetworkListByDeleted(): void {
    this.spinner.show();
    this.socialNetworkService.getSocialNetworkListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.alert.httpError(error);
      }
    });
  }

  modalSocialNetwork(socialNetwork?: SocialNetwork): void {
    const dialogRef = this.parameter.openDialog(FrmSocialNetworkComponent, {
      positions: this.records.length + 5,
      socialNetwork: socialNetwork
    });
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getSocialNetworkListByDeleted();
      }
    });
  }

  confirmDelete(socialNetwork: SocialNetwork): void {
    this.alert.confirmDelete(() => this.deleteSocialNetwork(socialNetwork));
  }

  deleteSocialNetwork(socialNetwork: SocialNetwork): void {
    this.spinner.show();
    this.socialNetworkService.deleteSocialNetwork(socialNetwork.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getSocialNetworkListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
