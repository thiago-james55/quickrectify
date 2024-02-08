import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Consumer } from '../../services/consumer.entity';
import { DialogConsumerCreateComponent } from '../dialog-consumer-create/dialog-consumer-create.component';
import { DialogConsumerSearchComponent } from '../dialog-consumer-search/dialog-consumer-search.component';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-consumer-handler',
    standalone: true,
    templateUrl: './consumer-handler.component.html',
    styleUrls: ['./consumer-handler.component.css', '../../../global.css'],
    imports: [CommonModule, DialogConsumerSearchComponent, DialogConsumerCreateComponent]
})
export class ConsumerHandlerComponent {


  @ViewChild(DialogConsumerSearchComponent)
  dialogConsumerSearchComponent!: DialogConsumerSearchComponent;

  @ViewChild(DialogConsumerCreateComponent)
  dialogConsumerCreateComponent!: DialogConsumerCreateComponent;

  @Input() table: boolean = false;

  @Input() consumer: Consumer = {};
  
  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  constructor(private toastService: ToastService) {}

  openSearchDialog(): void {
    this.dialogConsumerSearchComponent.openModal();    
  }

  openCreateDialog(consumer?: Consumer): void {
    this.dialogConsumerCreateComponent.openModal(consumer); 
  }

  getConsumerFromChildAndSendToParent(consumer: Consumer): void {
    this.consumer = { ...consumer };
    this.objectSentToParent.emit(consumer);
  }
 

}
