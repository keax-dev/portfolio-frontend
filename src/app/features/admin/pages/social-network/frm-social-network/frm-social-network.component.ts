import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialNetworkService } from '@features/admin/services/social-network.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { SocialNetwork } from '@shared/models/social-network';
import { AlertService } from '@core/services/alert.service';
import { UppercaseDirective } from '../../../../../shared/components/directive/uppercase.directive';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-frm-social-network',
    templateUrl: './frm-social-network.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, Select, ButtonComponent]
})
export class FrmSocialNetworkComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private socialNetworkService = inject(SocialNetworkService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  socialNetworForm!: FormGroup;

  positionList: number[] = [];
  title = 'New Social Network';

  update!: boolean;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.socialNetworForm = this.fb.group({
      name: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      color: ['', [Validators.required]],
      url: ['', [Validators.required]],
      position: [null, [Validators.required]]
    });

    this.positionList = Array.from({ length: this.config.data.positions }, (_, i) => i + 1);

    if (this.config.data.socialNetwork) {
      this.update = true;
      this.title = 'Update Social Network';
      this.socialNetworForm.patchValue(this.config.data.socialNetwork);
    }
  }

  onSubmit(): void {
    if (this.socialNetworForm.invalid) {
      this.socialNetworForm.markAllAsTouched();
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
    this.socialNetworkService.createSocialNetwork(this.socialNetworForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  updateSocialNetwork(): void {
    this.spinner.show();
    this.socialNetworkService.updateSocialNetwork(this.config.data.socialNetwork.id, this.socialNetworForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  close(socialNetwork?: SocialNetwork): void {
    this.ref.close(socialNetwork);
  }

  get controls() {
    return this.socialNetworForm.controls;
  }

}
