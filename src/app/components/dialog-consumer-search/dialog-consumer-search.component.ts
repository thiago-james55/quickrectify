import { getConsumers } from '../../service/model/Consumer.entity';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Consumer } from '../../service/model/Consumer.entity';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dialog-consumer-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-consumer-search.component.html',
  styleUrls: ['./dialog-consumer-search.component.css', '../../../global.css']
})
export class DialogConsumerSearchComponent {

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
    this.modal.nativeElement.close();
  }


}
