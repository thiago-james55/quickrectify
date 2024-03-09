import { ToastService } from './../../services/toast.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Consumer } from '../../services/consumer.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestHandlerService } from '../../services/request-handler.service';

@Component({
  selector: 'app-dialog-consumer-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-consumer-create.component.html',
  styleUrls: ['./dialog-consumer-create.component.css', '../../../global.css']
})
export class DialogConsumerCreateComponent {


  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  @Input() consumer: Consumer = {};

  @ViewChild('modal', { static: false })
  modal!: ElementRef<HTMLDialogElement>;

  constructor(private _toastService: ToastService, private _requestHandlerService: RequestHandlerService) { }

  openModal(consumer?: Consumer): void {

    if (consumer) this.consumer = this.consumer = { ...consumer };
    else this.consumer = {};

    if (this.modal && this.modal.nativeElement) {
      this.modal.nativeElement.showModal();
    }
  }

  sendObjectToParent(consumer: Consumer) {
    this.objectSentToParent.emit(consumer);
  }

  handleSave() {

    if (!this.validation()) return;

    if (this.consumer.id && this.consumer.id >= 0) this.editConsumer();
    else this.saveConsumer();

  }


  async saveConsumer(): Promise<void> {

    const savedConsumerId = await this._requestHandlerService.postConsumer(this.consumer);

    if (savedConsumerId == -1) return;

    if (!savedConsumerId) {
      this._toastService.showToastError("Erro ao salvar cliente!");
      return;
    } else {
      this.consumer.id = savedConsumerId;
      this._toastService.showToastSuccess(`Cliente N°(${this.consumer.id}) salvo com sucesso!`);
    }

    this.sendObjectToParent(this.consumer);
    this.closeModal();

  }

  async editConsumer(): Promise<void> {

    const editedConsumer = await this._requestHandlerService.putConsumer(this.consumer);

    if (!editedConsumer) return;
    else {
      this._toastService.showToastSuccess(`Cliente N°(${this.consumer.id}) editado com sucesso!`);
    }

    this.sendObjectToParent(this.consumer);
    this.closeModal();

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

  closeModal(): void {
    this.modal.nativeElement.close();
  }

}
