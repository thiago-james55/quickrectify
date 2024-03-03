import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Part, DefaultPart } from '../../services/part.entity';
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


  defaultParts: DefaultPart[] = [];

  @Input() order: Order = { parts: [] };

  constructor(
    private _toastService: ToastService,
    private _router: Router,
    private _requestHandlerService: RequestHandlerService
  ) { 
    this._requestHandlerService.getDefaultParts().then(parts => this.defaultParts = parts);
  }

  getConsumerFromChild(consumer: Consumer) {
    this.order.consumer = consumer;
    this.order.consumerId = consumer.id;
  }

  getServicesOfPart(part: Part): string[] | undefined {

    const foundPart = this.defaultParts.find((p) => p.name == part.name);

    if (foundPart) return foundPart.services;

    return undefined;

  }

  sumRow(part: Part): void {
    if (part.quantity && part.pricePerQuantity) {
      part.priceTotal = part.quantity * part.pricePerQuantity;
      this.sumTotal();     
    }
  }

  sumTotal() {

    if (this.order.parts.length <= 0) {
      this.order.priceSubTotal = 0;
      this.order.priceTotal = 0;
      return;
    }

    this.order.priceSubTotal = this.order.parts.reduce((accumulator, part) => accumulator + (part.priceTotal || 0), 0);
    this.order.priceTotal = this.order.priceSubTotal;
    if (!!this.order.discountCash) this.order.priceTotal -= this.order.discountCash;
    if (!!this.order.discountPercent) this.order.priceTotal -= ((this.order.priceTotal / 100) * this.order.discountPercent);
  }


  insertRow(defaultPart: DefaultPart): void {
    let part: Part = { name: defaultPart.name, service: defaultPart.services[0] };
    this.order.parts.push(part);

    part.quantity = 1;
    part.pricePerQuantity = 100;
    part.priceTotal = 100;
    
    this.sumRow(part);
  }

  deleteRow(part: Part): void {
    const index = this.order.parts.indexOf(part);
    this.order.parts.splice(index, 1);
    this.sumTotal();
  }

  handleSave(print: boolean): void {

    if (!this.validateOrder()) return;

    if (this.order.id) this.editOrder(print);
    else this.saveOrder(print);

  }

  
  async saveOrder(print: boolean): Promise<void> {

      const savedOrder = await this._requestHandlerService.postOrder(this.order);
  
      if (!savedOrder) {
        this._toastService.showToastError("Erro ao salvar ordem de serviço!");
        return;
      }
  
      this.order.id = savedOrder;
      
      if (print) this.print();  
      else this._toastService.showToastSuccess(`Ordem (${this.order.id}) salva com sucesso!`);
  
      this.clearOrder();
    
  }
  

  async editOrder(print: boolean): Promise<void> {

    const editedOrder = await this._requestHandlerService.putOrder(this.order);

    if (!editedOrder) {
      this._toastService.showToastError("Erro ao editar ordem de serviço!");
      return;
    }

    if (print) { this.print() }
    else { 
      this._toastService.showToastSuccess(`Ordem (${this.order.id}) editada com sucesso!`);
    }

    this.clearOrder(); 
  }

  validateOrder(): boolean {

    let fields: string[] = [];

    if (!this.order['consumer']) fields.push("Cliente");
    if (!(this.order['parts'].length > 0)) fields.push("Tabela de Serviços");
    if (this.order && (this.order.priceTotal === undefined || this.order.priceTotal <= 0)) {
      fields.push("Valor Total");
    }

    let parts: boolean = true;

    this.order.parts.forEach(p => {
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

    const url = this._router.createUrlTree(['note'], {
      queryParams: { orderId: this.order.id }
    }).toString();

    window.open(url, '_blank');
  }

  clearOrder() {
    this.order = { parts: [] };
    this.order = {
      ...this.order,
      id: undefined,
      date: undefined,
      consumer: undefined,
      discountPercent: undefined,
      discountCash: undefined,
      priceSubTotal: undefined,
      priceTotal: undefined,
    };
  }
  

  formatValue(value: number | undefined): string {
    if (value) return value.toFixed(2);
    else return "0.00";
  }

}

