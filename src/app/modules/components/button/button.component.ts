import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: false
})
export class ButtonComponent implements OnInit {

  @Input() disabled = false;
  @Input() cancel = false;

  @Input() classPadding = 'px-4';
  @Input() class = 'btn btn-primary';
  @Input() text = 'Save';
  @Input() icon = 'pi pi-save';
  @Input() type = 'submit';

  @Output() action = new EventEmitter();

  ngOnInit(): void {
    this.loadCancelButton();
  }

  loadCancelButton(): void {
    if (this.cancel) {
      this.class = 'btn btn-secondary';
      this.text = 'Cancel';
      this.icon = 'pi pi-times';
      this.type = 'button';
    }
    this.classPadding += ' ';
    this.class += ' ';
    this.icon += ' mx-2';
  }

  clickAction(): void {
    this.action.emit();
  }

}
