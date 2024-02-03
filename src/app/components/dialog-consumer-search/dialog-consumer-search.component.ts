import { getConsumers } from '../../services/consumer.entity';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Consumer } from '../../services/consumer.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dialog-consumer-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-consumer-search.component.html',
  styleUrls: ['./dialog-consumer-search.component.css', '../../../global.css']
})
export class DialogConsumerSearchComponent {

  
  consumerName!: string;

  consumers: Consumer[] = getConsumers();

  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

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

  onConsumerChoose(consumer: Consumer) {
    this.sendObjectToParent(consumer);
    this.closeModal();
  }

  closeModal(): void {
    this.modal.nativeElement.close();
  }

  searchConsumer() {

  }

}
