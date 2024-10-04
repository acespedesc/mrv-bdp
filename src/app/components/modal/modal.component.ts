import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen=false;
  @Output() closeModal= new EventEmitter();

  onCloseModal(){
    this.closeModal.emit(false);
  }
  

}
