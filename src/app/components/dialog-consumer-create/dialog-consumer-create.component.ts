import { ToastService } from './../../services/toast.service';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Consumer } from '../../services/consumer.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-consumer-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-consumer-create.component.html',
  styleUrls: ['./dialog-consumer-create.component.css', '../../../global.css']
})
export class DialogConsumerCreateComponent {

  constructor(private _toastService: ToastService) {}

  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  consumer: Consumer = {};

  @ViewChild('modal', { static: false }) // Add { static: false } to avoid "ExpressionChangedAfterItHasBeenCheckedError"
  modal!: ElementRef<HTMLDialogElement>;

  openModal(): void {

    if (this.modal && this.modal.nativeElement) {
      this.modal.nativeElement.showModal();
    }

  }

  sendObjectToParent(consumer: Consumer) {
    this.objectSentToParent.emit(consumer);
  }

  onConsumerCreate() {
    if (this.validation()) {
      if (this.postConsumer())
        this.sendObjectToParent(this.consumer);
      this.closeModal();
    }
  }

  validation(): boolean {
    if (this.consumer) {
        if (!!this.consumer.name && !!this.consumer.document && !!this.consumer.phone1) {
            return true;
        } else {
            let fields: string[] = [];
            if (!!!this.consumer['name']) fields.push("nome");
            if (!!!this.consumer['document']) fields.push("RG/CPF");
            if (!!!this.consumer['phone1']) fields.push("Telefone 1");

            let message = "Os campos " + fields.join(', ') + " não podem estar vazios!";
            this._toastService.showToastCaution(message);
        }
    }
    return false;
}

  postConsumer(): boolean {
    //service.PostConsumer;
    return true;
  }

  closeModal(): void {
    this.modal.nativeElement.close();
  }

}
