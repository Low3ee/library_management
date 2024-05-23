import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-info-modal',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './edit-info-modal.component.html',
})
export class EditInfoModalComponent {
  @Input() isOpen: boolean = false;
  @Input() userDetails: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.userDetails);
  }
}
