import { ConfirmationService } from 'primeng/api';
import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '@app/shared/interfaces/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private confirmation = inject(ConfirmationService);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);

  success(sms: string): void {
    this.toastr.success(sms, 'Success');
  }

  info(sms: string): void {
    this.toastr.info(sms, 'Message');
  }

  warning(sms: string): void {
    this.toastr.warning(sms, 'Warning');
  }

  error(sms: string, title?: string): void {
    this.toastr.error(sms, title || 'An error occurred');
  }

  applicationError(sms?: string, title?: string): void {
    this.spinner.hide();
    this.toastr.error(sms || "Please contact support", title || 'An error occurred');
  }

  resultWarnings<T>(response: ApiResponse<T>): void {
    response.messages?.forEach(message => this.warning(message));
    this.error(response.alert);
  }


  confirmDelete(function_: () => void) {
    this.confirmation.confirm({
      message: "You won't be able to undo this!",
      header: "You're sure?",
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        icon: 'pi pi-times',
        severity: 'contrast'
      },
      acceptButtonProps: {
        label: 'Confirm',
        icon: 'pi pi-check',
        severity: 'danger',
      },
      accept: () => function_()
    });
  }

}
