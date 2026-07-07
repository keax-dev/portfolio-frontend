import { Component, computed, output, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly loadingText = input('');
  readonly loadingIcon = input('pi pi-spin pi-spinner');
  readonly ariaLabel = input('');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly cancel = input(false);
  readonly cancelText = input('');

  readonly classPadding = input('px-4');
  readonly customClass = input('btn btn-primary');
  readonly text = input('');
  readonly icon = input('pi pi-save');
  readonly type = input('submit');

  readonly action = output<void>();

  protected readonly buttonClass = computed(() => {
    const baseClass = this.cancel() ? 'btn btn-secondary' : this.customClass();
    return `${baseClass} ${this.classPadding()} d-flex justify-content-center align-items-center m-2`;
  });

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());
  protected readonly buttonText = computed(() => {
    if (this.cancel()) {
      return this.cancelText() || 'Cancel';
    }

    if (this.loading()) {
      return this.loadingText() || 'Saving...';
    }

    return this.text() || 'Save';
  });
  protected readonly buttonIcon = computed(() => {
    const icon = this.cancel() ? 'pi pi-times' : this.loading() ? this.loadingIcon() : this.icon();
    return icon ? `${icon} mx-2` : '';
  });
  protected readonly buttonType = computed(() => (this.cancel() ? 'button' : this.type()));
  protected readonly buttonAriaLabel = computed(() => this.ariaLabel() || this.buttonText());

  clickAction(): void {
    this.action.emit();
  }
}
