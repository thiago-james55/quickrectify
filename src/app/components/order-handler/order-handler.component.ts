import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderPart, Part, getParts } from '../../service/model/Part.entity';
import { FormsModule } from '@angular/forms';
import { CustomerHandlerComponent } from "../customer-handler/customer-handler.component";
import { Customer } from '../../service/model/Customer.entity';

@Component({
    selector: 'app-order-handler',
    standalone: true,
    templateUrl: './order-handler.component.html',
    styleUrls: ['./order-handler.component.css', '../../../global.css'],
    imports: [CommonModule, FormsModule, CustomerHandlerComponent]
})

export class OrderHandlerComponent {

  //Service.getGroups
  defaultParts: Part[] = getParts();

  //FinalOrderObject
  customer: Customer = {};
  orderParts: OrderPart[] = [];

  getCustomerFromChild(customer: Customer) {
    this.customer = customer;
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

