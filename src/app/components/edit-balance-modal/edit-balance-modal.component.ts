import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-balance-modal',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './edit-balance-modal.component.html',
})
export class EditBalanceModalComponent {
  @Input() isOpen: boolean = false;
  @Input() studentDetails: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.studentDetails);
  }
}
