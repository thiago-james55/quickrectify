import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

export class OrderHandlerComponent implements OnInit {

  defaultParts: DefaultPart[] = [];
  isSaving: boolean = false;
  private timeoutId: any;
  isAllPartsPaid: boolean = false;

  @Input() order: Order = { parts: [] };

  constructor(
    private _toastService: ToastService,
    private _router: Router,
    private _requestHandlerService: RequestHandlerService
  ) { }

  ngOnInit(): void {
    this.loadDefaultParts();
    this.getEngineBlockNumberImage();
  }

  ngDoCheck(): void {
    this.checkAllPartsIsPaid();
  }

  private async loadDefaultParts(): Promise<void> {
    this.defaultParts = await this._requestHandlerService.getDefaultParts();
  }

  getConsumerFromChild(consumer: Consumer) {
    this.order.consumer = consumer;
    this.order.consumerId = consumer.id;
  }

  getServicesOfPart(part: Part): string[] | undefined {
    return this.defaultParts.find((p) => p.name === part.name)?.services;
  }

  sumRow(part: Part): void {
    if (part.quantity && part.pricePerQuantity) {
      part.priceTotal = part.quantity * part.pricePerQuantity;
      this.sumTotal();     
    }
  }

  sumTotal(): void {
    if (this.order.parts.length <= 0) {
      this.order.priceSubTotal = 0;
      this.order.priceTotal = 0;
      return;
    }

    this.order.priceSubTotal = this.order.parts.reduce((accumulator, part) => accumulator + (part.priceTotal || 0), 0);
    this.order.priceTotal = this.order.priceSubTotal;

    if (this.order.discountCash) this.order.priceTotal -= this.order.discountCash;
    if (this.order.discountPercent) {
      this.order.priceTotal -= ((this.order.priceTotal / 100) * this.order.discountPercent);
    }
  }

  insertRow(defaultPart: DefaultPart): void {
    const part: Part = { name: defaultPart.name, service: defaultPart.services[0], quantity: 1, pricePerQuantity: 100, priceTotal: 100, isPaid: false };
    this.order.parts.push(part);
    this.sumRow(part);
    this.checkAllPartsIsPaid();
  }

  deleteRow(part: Part): void {
    const index = this.order.parts.indexOf(part);
    if (index > -1) {
      this.order.parts.splice(index, 1);
    }
    this.sumTotal();
  }

  handleSave(print: boolean): void {
    this.isSaving = true;
    
    if (!this.validateOrder()) {
      this.isSaving = false;
      return;
    }

    if (this.order.id) this.editOrder(print);
    else this.saveOrder(print);
  }

  async saveOrder(print: boolean): Promise<void> {
    const savedOrderId = await this._requestHandlerService.postOrder(this.order);

    if (!savedOrderId) {
      this._toastService.showToastError("Erro ao salvar ordem de serviço!");
      this.isSaving = false;
      return;
    }

    this.order.id = savedOrderId;

    if (print) this.print();  
    else this._toastService.showToastSuccess(`Ordem (${this.order.id}) salva com sucesso!`);

    this.isSaving = false;
    this.clearOrder();
  }

  async getEngineBlockNumberImage(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(async () => {
      if (this.order.id) {
        this.order.engineBlockNumberImage = await this._requestHandlerService.getOrderEngineBlockNumberImageById(this.order.id);
      }
    }, 1000);
  }
  

  async editOrder(print: boolean): Promise<void> {
    const editedOrderId = await this._requestHandlerService.putOrder(this.order);

    if (!editedOrderId) {
      this._toastService.showToastError("Erro ao editar ordem de serviço!");
      this.isSaving = false;
      return;
    }

    if (print) {
      this.print();
    } else {
      this._toastService.showToastSuccess(`Ordem (${this.order.id}) editada com sucesso!`);
    }

    this.isSaving = false;
    this.clearOrder();
    setTimeout(() => this._router.navigate(['./list-orders']), 1000);
  }

  validateOrder(): boolean {
    const fields: string[] = [];

    if (!this.order.consumer) fields.push("Cliente");
    if (this.order.parts.length === 0) fields.push("Tabela de Serviços");
    if (this.order.priceTotal === undefined || this.order.priceTotal <= 0) fields.push("Valor Total");

    if (this.order.parts.some(p => !p.description)) {
      fields.push("Descrição de Serviços");
    }

    if (fields.length > 0) {
      this._toastService.showToastCaution(`Os campos ${fields.join(' e ')} não podem estar vazios!`);
      return false;
    }

    return true;
  }

  print(): void {
    const url = this._router.createUrlTree(['./quickrectify/note'], { queryParams: { orderId: this.order.id } }).toString();
    window.open(url, '_blank');
  }

  clearOrder(): void {
    this.order = { parts: [] };
  }

  formatValue(value: number | undefined): string {
    return value ? value.toFixed(2) : "0.00";
  }
  
  onFileSelected(event: any): void {
  
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = (e.target?.result as string).split(',')[1];
        this.order.engineBlockNumberImage = base64String;
      };

      reader.readAsDataURL(file);
    }
  }

  removeEngineBlockImage() {
      this.order.engineBlockNumberImage = undefined;
  }

  checkAllPartsIsPaid() {
    if (this.orderHaveParts()) {
      this.isAllPartsPaid = this.order.parts.every(e => e.isPaid);
    }
  }
  
  changeAllPartsToPaidOrNotPaid() {
    if (!this.orderHaveParts()) return;
  
    this.isAllPartsPaid = !this.isAllPartsPaid;
    this.order.parts.forEach(e => e.isPaid = this.isAllPartsPaid);
  }
  
  orderHaveParts(): boolean {
    return this.order.parts.length > 0;
  }
  

}
