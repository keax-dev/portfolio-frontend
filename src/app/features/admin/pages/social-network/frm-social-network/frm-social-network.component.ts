import {
  NonNullableFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Component,
  inject,
  DestroyRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { finalize } from 'rxjs';

interface SocialNetworkDialogData {
  readonly positions: number;
  readonly socialNetwork?: SocialNetwork;
}

@Component({
  selector: 'app-frm-social-network',
  templateUrl: './frm-social-network.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, ButtonComponent],
})
export class FrmSocialNetworkComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly socialNetworkService = inject(SocialNetworkService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<SocialNetworkDialogData>(DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<DialogRef<SocialNetwork>>(DialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly socialNetworkForm = this.fb.group({
    name: ['', Validators.required],
    icon: ['', Validators.required],
    color: ['', Validators.required],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\//i)]],
    position: [0, [Validators.required, Validators.min(1)]],
  });

  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  title = 'New Social Network';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.data.socialNetwork) {
      this.update = true;
      this.title = 'Update Social Network';
      this.socialNetworkForm.patchValue(this.data.socialNetwork);
    }
  }

  onSubmit(): void {
    if (this.socialNetworkForm.invalid) {
      this.socialNetworkForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateSocialNetwork();
      return;
    }

    this.createSocialNetwork();
  }

  createSocialNetwork(): void {
    this.spinner.show();
    this.socialNetworkService
      .createSocialNetwork(this.socialNetworkForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  updateSocialNetwork(): void {
    this.spinner.show();
    this.socialNetworkService
      .updateSocialNetwork(this.data.socialNetwork!.id!, this.socialNetworkForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  close(socialNetwork?: SocialNetwork): void {
    this.ref.close(socialNetwork);
  }

  get controls(): typeof this.socialNetworkForm.controls {
    return this.socialNetworkForm.controls;
  }
}
