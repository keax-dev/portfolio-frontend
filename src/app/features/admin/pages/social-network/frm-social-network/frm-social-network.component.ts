import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { finalize } from 'rxjs';
import { httpsUrlValidator } from '@core/validators/external-url.validator';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

interface SocialNetworkDialogData {
  readonly positions: number;
  readonly socialNetwork?: SocialNetwork;
}

@Component({
  selector: 'app-frm-social-network',
  templateUrl: './frm-social-network.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    MatFormFieldModule,
    ButtonComponent,
    MatSelectModule,
    MatInputModule,
  ],
})
export class FrmSocialNetworkComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly socialNetworkService = inject(SocialNetworkService);
  private readonly data = inject<SocialNetworkDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, SocialNetwork>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly socialNetworkForm = this.fb.group({
    name: ['', Validators.required],
    icon: ['', Validators.required],
    color: ['', Validators.required],
    url: ['', [Validators.required, httpsUrlValidator()]],
    position: [0, [Validators.required, Validators.min(1)]],
  });

  readonly isSaving = signal(false);
  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  title = 'New Social Network';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  loadVariables(): void {
    if (this.data.socialNetwork) {
      this.update = true;
      this.title = 'Update Social Network';
      this.socialNetworkForm.patchValue(this.data.socialNetwork);
    }
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

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
    this.isSaving.set(true);
    this.socialNetworkService
      .createSocialNetwork(this.socialNetworkForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  updateSocialNetwork(): void {
    this.isSaving.set(true);
    this.socialNetworkService
      .updateSocialNetwork(this.data.socialNetwork!.id!, this.socialNetworkForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  close(socialNetwork?: SocialNetwork): void {
    this.ref.close(socialNetwork);
  }

  get controls(): typeof this.socialNetworkForm.controls {
    return this.socialNetworkForm.controls;
  }
}
