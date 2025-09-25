import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: false
})
export class ButtonComponent {

  @Input() disabled = false;
  @Input() class = 'btn btn-primary px-4 py-2';
  @Input() text = 'Save';
  @Input() icon = 'pi pi-save';
  @Input() type = 'submit';

  @Output() action = new EventEmitter();

  clickAction(): void {
    this.action.emit();
  }

}
