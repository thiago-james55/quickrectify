import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderPart, Part } from '../../services/part.entity';
import { FormsModule } from '@angular/forms';
import { Consumer } from '../../services/consumer.entity';
import { ConsumerHandlerComponent } from '../consumer-handler/consumer-handler.component';
import { Order } from '../../services/order.entity';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { RequestHandlerService } from '../../services/request-handler.service';


@Component({
  selector: 'app-order-handler',
  standalone: true,
  templateUrl: './order-handler.component.html',
  styleUrls: ['./order-handler.component.css', '../../../global.css'],
  imports: [CommonModule, FormsModule, ConsumerHandlerComponent]
})

export class OrderHandlerComponent {


  defaultParts: Part[] = this._requestHandlerService.getDefaultParts();

  @Input() order: Order = { orderParts: [] };

  constructor(
    private _toastService: ToastService,
    private _router: Router,
    private _requestHandlerService: RequestHandlerService
  ) { }

  getConsumerFromChild(consumer: Consumer) {
    this.order.consumer = consumer;
  }

  getServicesOfPart(part: OrderPart): string[] | undefined {

    const foundPart = this.defaultParts.find((p) => p.name == part.name);

    if (foundPart) return foundPart.services;

    return undefined;

  }

  sumRow(part: OrderPart): void {
    
    if (!!!part.quantity) part.quantity = 1;
    if (!!!part.pricePerQuantity) part.pricePerQuantity = 100;

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
    this.sumRow(orderPart);
  }

  deleteRow(part: OrderPart): void {
    const index = this.order.orderParts.indexOf(part);
    this.order.orderParts.splice(index, 1);
    this.sumTotal();
  }

  handleSave(print: boolean): void {

    if (!this.validateOrder()) return;

    if (this.order.id) this.editOrder(print);
    else this.saveOrder(print);

  }

  
  saveOrder(print: boolean) {

    const savedOrder = this._requestHandlerService.postOrder(this.order);

    if (!savedOrder) {
      this._toastService.showToastError("Erro ao salvar ordem de serviço!");
      return;
    }

    this.order = savedOrder;
    if (print) { this.print() }
    else { 
      this._toastService.showToastSuccess(`Ordem (${this.order.id}) salva com sucesso!`);
    }

    this.clearOrder(); 

  }

  editOrder(print: boolean) {

    const editedOrder = this._requestHandlerService.putOrder(this.order);

    if (!editedOrder) {
      this._toastService.showToastError("Erro ao editar ordem de serviço!");
      return;
    }

    this.order = editedOrder;

    if (print) { this.print() }
    else { 
      this._toastService.showToastSuccess(`Ordem (${this.order.id}) editada com sucesso!`);
    }

    this.clearOrder(); 
  }

  validateOrder(): boolean {

    let fields: string[] = [];

    if (!this.order['consumer']) fields.push("Cliente");
    if (!(this.order['orderParts'].length > 0)) fields.push("Tabela de Serviços");
    if (this.order && (this.order.priceTotal === undefined || this.order.priceTotal <= 0)) {
      fields.push("Valor Total");
    }

    let parts: boolean = true;

    this.order.orderParts.forEach(p => {
        if (!!!p.description) {
            parts = false;
            return;
        }
    });

    if (!parts) fields.push("Descrição de Serviços");

    if (fields.length > 0) {
      let message = "Os campos " + fields.join(' e ') + " não podem estar vazios!";
      this._toastService.showToastCaution(message);
      return false;
    }

    return true;
  }

  print(): void {

    this.order.id = 1;

    /*
    if (!!!this.order) return;
    if (!!!this.order.id) return;
    */

    //
    localStorage.setItem(this.order.id.toString(), JSON.stringify(this.order));

    //
    const url = this._router.createUrlTree(['note'], {
      queryParams: { orderId: this.order.id }
    }).toString();

    window.open(url, '_blank');
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

