import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderPart, Part, getParts } from '../../services/part.entity';
import { FormsModule } from '@angular/forms';
import { Consumer } from '../../services/consumer.entity';
import { ConsumerHandlerComponent } from '../consumer-handler/consumer-handler.component';
import { Order } from '../../services/order.entity';
import { ToastService } from '../../services/toast.service';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-order-handler',
  standalone: true,
  templateUrl: './order-handler.component.html',
  styleUrls: ['./order-handler.component.css', '../../../global.css'],
  imports: [CommonModule, FormsModule, ConsumerHandlerComponent]
})

export class OrderHandlerComponent {

  constructor(private _toastService: ToastService, private _router: Router, private _route: ActivatedRoute) { }

  //Service.getGroups
  defaultParts: Part[] = getParts();

  @Input() order: Order = { orderParts: [] };


  getConsumerFromChild(consumer: Consumer) {
    this.order.consumer = consumer;
  }

  getServicesOfPart(part: OrderPart): string[] | undefined {

    const foundPart = this.defaultParts.find((p) => p.name == part.name);

    if (foundPart) return foundPart.services;

    return undefined;

  }

  sumRow(part: OrderPart): void {
    if (part.quantity && part.pricePerQuantity) {
      part.priceTotal = part.quantity * part.pricePerQuantity;
      this.sumTotal();
    }
  }

  sumTotal() {

    if (this.order.orderParts.length <= 0) {
      this.order.priceSubTotal = 0;
      this.order.priceTotal = 0;
      return;
    }

    this.order.priceSubTotal = this.order.orderParts.reduce((accumulator, orderPart) => accumulator + (orderPart.priceTotal || 0), 0);
    this.order.priceTotal = this.order.priceSubTotal;
    if (!!this.order.discountCash) this.order.priceTotal -= this.order.discountCash;
    if (!!this.order.discountPercent) this.order.priceTotal -= ((this.order.priceTotal / 100) * this.order.discountPercent);


  }


  insertRow(part: Part): void {
    //Adjust for constructor(edit Order)
    let orderPart: OrderPart = { name: part.name, service: part.services[0] };
    this.order.orderParts.push(orderPart);
  }

  deleteRow(part: OrderPart): void {
    const index = this.order.orderParts.indexOf(part);
    this.order.orderParts.splice(index, 1);
    this.sumTotal();
  }

  saveOrder(print: boolean): void {
    if (this.validateOrder()) {

      //service.postOrder if success toasty
      console.log(this.order);

      this.order.id = 1;
      if (print) { this.print() } 
      else  { this.clearOrder(); }
      
    }

  }

  validateOrder(): boolean {
    let fields: string[] = [];

    if (!this.order['consumer']) fields.push("Cliente");
    if (!(this.order['orderParts'].length > 0)) fields.push("Tabela de Serviços");
    if (this.order && (this.order.priceTotal === undefined || this.order.priceTotal <= 0)) {
      fields.push("Valor Total");
    }

    if (fields.length > 0) {
      let message = "Os campos " + fields.join(' e ') + " não podem estar vazios!";
      this._toastService.showToastCaution(message);
      return false;
    }

    return true;
  }

  print(): void {

    if (!!!this.order) return;
    if (!!!this.order.id) return;

    localStorage.setItem(this.order.id.toString(), JSON.stringify(this.order));

    const url = this._router.createUrlTree(['note'], {
      queryParams: { orderId: this.order.id }
    }).toString();

    window.open(url, '_blank');
    this.clearOrder();
  }

  clearOrder() {
    this.order = { orderParts: [] };
    this.order.id = undefined;
    this.order.date = undefined;
    this.order.consumer = undefined;
    this.order.discountPercent = undefined;
    this.order.discountCash = undefined;
    this.order.priceSubTotal = undefined;
    this.order.priceTotal = undefined;
  }

}

