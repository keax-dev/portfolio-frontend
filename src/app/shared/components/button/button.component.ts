import { Component, computed, output, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly cancel = input(false);

  readonly classPadding = input('px-4');
  readonly customClass = input('btn btn-primary');
  readonly text = input('Save');
  readonly icon = input('pi pi-save');
  readonly type = input('submit');

  readonly action = output<void>();

  protected readonly buttonClass = computed(() => {
    const baseClass = this.cancel() ? 'btn btn-secondary' : this.customClass();
    return `${baseClass} ${this.classPadding()} d-flex justify-content-center align-items-center m-2`;
  });

  protected readonly buttonText = computed(() => (this.cancel() ? 'Cancel' : this.text()));
  protected readonly buttonIcon = computed(
    () => `${this.cancel() ? 'pi pi-times' : this.icon()} mx-2`,
  );
  protected readonly buttonType = computed(() => (this.cancel() ? 'button' : this.type()));

  clickAction(): void {
    this.action.emit();
  }
}
