import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Consumer } from '../../services/consumer.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestHandlerService } from '../../services/request-handler.service';


@Component({
  selector: 'app-dialog-consumer-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-consumer-search.component.html',
  styleUrls: ['./dialog-consumer-search.component.css', '../../../global.css']
})
export class DialogConsumerSearchComponent {

  
  consumerName!: string;

  defaultConsumers: Consumer[] = [];
  filteredConsumers: Consumer[] = [];

  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false })
  modal!: ElementRef<HTMLDialogElement>;

  constructor (private _requestHandlerService: RequestHandlerService) { }

  async openModal(): Promise<void> {

    this.defaultConsumers = await this._requestHandlerService.getConsumers();
    this.filteredConsumers = this.defaultConsumers;

    if (this.modal && this.modal.nativeElement) {
      this.modal.nativeElement.showModal();
    }

  }
 
  sendObjectToParent(consumer: Consumer) {
    this.objectSentToParent.emit(consumer);
  }

  onConsumerChoose(consumer: Consumer) {
    this.sendObjectToParent(consumer);
    this.closeModal();
  }

  closeModal(): void {
    this.modal.nativeElement.close();
  }

  searchConsumer() {
    if (!this.consumerName) return;
    this.filteredConsumers = this.defaultConsumers.filter(c => c.name?.toLowerCase().includes(this.consumerName.toLocaleLowerCase()))
  }


}
