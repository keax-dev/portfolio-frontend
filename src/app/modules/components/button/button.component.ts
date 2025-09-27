import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: false
})
export class ButtonComponent implements OnInit {

  @Input() disabled = false;
  @Input() class = 'btn btn-primary';
  @Input() classPadding = 'px-4';
  @Input() text = 'Save';
  @Input() icon = 'pi pi-save';
  @Input() type = 'submit';
  @Input() cancel = false;

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
  }

  clickAction(): void {
    this.action.emit();
  }

}
