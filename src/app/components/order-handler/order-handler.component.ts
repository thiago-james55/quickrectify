import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderPart, Part, getParts } from '../../service/model/Part.entity';
import { FormsModule } from '@angular/forms';
import { Consumer } from '../../service/model/Consumer.entity';
import { ConsumerHandlerComponent } from '../consumer-handler/consumer-handler.component';

@Component({
    selector: 'app-order-handler',
    standalone: true,
    templateUrl: './order-handler.component.html',
    styleUrls: ['./order-handler.component.css', '../../../global.css'],
    imports: [CommonModule, FormsModule, ConsumerHandlerComponent]
})

export class OrderHandlerComponent {

  //Service.getGroups
  defaultParts: Part[] = getParts();

  //FinalOrderObject
  consumer: Consumer = {};
  orderParts: OrderPart[] = [];

  getConsumerFromChild(consumer: Consumer) {
    this.consumer = consumer;
  }

  getServicesOfPart(part: OrderPart): string[] | undefined {

    const foundPart = this.defaultParts.find((p) => p.name == part.name);

    if (foundPart) return foundPart.services;

    return undefined;

  }

  sumRow(part: OrderPart): void {
    if (part.quantity && part.pricePerQuantity) {
      part.priceTotal = part.quantity * part.pricePerQuantity;
    }    
  }


  insertRow(part: Part): void {
    let orderPart: OrderPart = { name:part.name , service: part.services[0]};
    this.orderParts.push(orderPart);
    console.log(this.orderParts);
  }

  deleteRow(part: OrderPart): void {
    const index = this.orderParts.indexOf(part);
    this.orderParts.splice(index, 1);
  }


}

