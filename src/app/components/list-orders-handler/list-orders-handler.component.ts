import { Component, ViewChild } from '@angular/core';
import { Part } from '../../services/part.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consumer } from '../../services/consumer.entity';
import { DialogConsumerSearchComponent } from "../dialog-consumer-search/dialog-consumer-search.component";
import { Order } from '../../services/order.entity';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RequestHandlerService } from '../../services/request-handler.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-list-orders-handler',
  standalone: true,
  templateUrl: './list-orders-handler.component.html',
  styleUrls: ['./list-orders-handler.component.css', '../../../global.css'],
  imports: [CommonModule, FormsModule, DialogConsumerSearchComponent, RouterLink]
})

export class ListOrdersHandlerComponent {

  isDropdownVisible: boolean = false;
  dropdownPosition: { left: number, top: number } = { left: 0, top: 0 };
  dropdownOptions: DropdownOption[] = [];

  isHoverVisible: boolean = false;
  HoverContentOption: HoverContentOption = {};

  @ViewChild(DialogConsumerSearchComponent)
  dialogConsumerSearchComponent!: DialogConsumerSearchComponent;

  defaultParts: Part[] = [];

  defaultOrders: Order[] = [];
  filteredOrders: Order[] = [];

  filterByOrderNumber!: number;
  filterByConsumerName!: string;
  filterByPart: string = "all";
  filterByInitialDate!: Date;
  filterByFinalDate!: Date;
  filterTotalOfOrder: string = "yes";
  filterTotalOfSelection: string = "no";

  public readonly ORDER_ENGINEBLOCKNUMBERIMAGE_URL: string;
  lastOrderId: number = 0;

  constructor(private _route: ActivatedRoute, private _requestHandlerService: RequestHandlerService, private _toastService: ToastService) {
    this.filteredOrders = this.defaultOrders;
    this.ORDER_ENGINEBLOCKNUMBERIMAGE_URL = _requestHandlerService.ORDER_ENGINEBLOCKNUMBERIMAGE_URL;
  }



  async ngOnInit() {
    try {
      const consumerName = await this._route.snapshot.queryParamMap.get('consumerName');
      if (consumerName) this.setConsumerName(consumerName);

      this.defaultParts = await this._requestHandlerService.getDefaultParts();
      this.defaultOrders = await this._requestHandlerService.getOrdersOfThisYear();
      this.filteredOrders = this.defaultOrders;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  filter(): void {

    const orderNumberCondition = (order: Order) => (
      !this.filterByOrderNumber || ( order.id == this.filterByOrderNumber ) 
    );


    const consumerCondition = (order: Order) => (
      !this.filterByConsumerName || (
        order.consumer && order.consumer.name!.toLowerCase().includes(this.filterByConsumerName.toLowerCase())
      )
    );

    const dateCondition = (order: Order) => (
      (!this.filterByInitialDate || order.date! >= new Date(this.filterByInitialDate)) &&
      (!this.filterByFinalDate || order.date! <= new Date(this.filterByFinalDate))
    );

    

    let orderPartCondition = (order: Order) => (
      !this.filterByPart || (
        order.parts && order.parts.some(part => part.name.toLowerCase().includes(this.filterByPart.toLowerCase()))
      )
    );


    if (this.filterByPart.toLocaleLowerCase().includes("all")) orderPartCondition = () => true;

    const predicates = [orderNumberCondition, consumerCondition, dateCondition, orderPartCondition];

    this.checkFilterIsForCurrentYear();

    if (this.defaultOrders) {

      this.filteredOrders = this.defaultOrders.filter(order =>
        predicates.every(predicate => predicate(order))
      );
    }
  }

  setConsumerName(consumerName: string | undefined) {
    if (consumerName) this.filterByConsumerName = consumerName;
    this.filter();
  }

  openSearchDialog(): void {
    this.dialogConsumerSearchComponent.openModal();
  }

  getConsumerFromChildAndSendToParent(consumer: Consumer): void {
    this.filterByConsumerName = consumer.name!;
    this.filter();
  }


  getTotalOfFilteredOrders(): string {
    return this.filteredOrders.map(o => o.priceTotal ? o.priceTotal : 0).reduce((sum, current) => sum + current, 0).toFixed(2);
  }

  showDropdown(event: MouseEvent, data: Order | Consumer | undefined): void {

    this.isDropdownVisible = true;
    this.calculateDropdownPosition(event);

    if (data) {
      this.dropdownOptions = [];
      if ('parts' in data) {
        this.orderDropdownOptions(data);
      } else {
        this.consumerDropDownOptions(data);
      }
    }

  }

  async showHover(event: MouseEvent, order: Order | undefined ): Promise<void> {

    if (!order) return;

    this.isHoverVisible = true;
    this.calculateDropdownPosition(event);

    if (this.lastOrderId === order.id) return;
    else this.HoverContentOption = {};

    if (order.id) {
      this.lastOrderId = order.id;
      this.HoverContentOption.orderId = order.id;
      this.HoverContentOption.consumerName = order.consumer?.name;
      this.HoverContentOption.engineBlockNumberImage = await this._requestHandlerService.getOrderEngineBlockNumberImageById(order.id);
    }

  }

  orderDropdownOptions(order: Order) {
    const queryParam = { orderId: order.id };
    this.dropdownOptions = [
      { description: "2° Via", url: "/note", queryParam, target: "_blank" },
      { description: "Editar", url: "/new-order", queryParam, target: "_self" },
    ]
  }

  consumerDropDownOptions(consumer: Consumer) {

    const queryParam = { consumerId: consumer.id };
    this.dropdownOptions = [
      { description: "Listar Ordens", consumerName: consumer.name },
      { description: "Ver/Editar Cliente", url: "/consumers", queryParam, target: "_self" },
    ]

    const whatsappURL: string = "https://api.whatsapp.com/send?phone=+55";

    const phoneProperties: (keyof Consumer)[] = ['phone1', 'phone2', 'phone3'];

    phoneProperties.forEach(property => {
      if (consumer[property]) {
        this.dropdownOptions.push({
          description: `Tel (${phoneProperties.indexOf(property) + 1}): ${consumer[property]}`,
          url: whatsappURL + consumer[property],
          target: "_blank"
        });
      }
    });
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  hideHover() {
    this.isHoverVisible = false;
  }

  calculateDropdownPosition(event: MouseEvent) {
    this.dropdownPosition = {
      left: event.clientX -10,
      top: event.clientY -10
    };
  }

  async checkFilterIsForCurrentYear(): Promise<void> {
    if (!this.filterByInitialDate) return;

    const currentYear = new Date().getFullYear();
    const initialDate = new Date(this.filterByInitialDate);
    const finalDate = this.filterByFinalDate ? new Date(this.filterByFinalDate) : new Date();

    if (initialDate instanceof Date && isNaN(initialDate.getTime())) {
      this._toastService.showToastError("Data Inicial Inválida!");
      return;
    }

    if (finalDate instanceof Date && isNaN(finalDate.getTime())) {
      this._toastService.showToastError("Data Final Inválida!");
      return;
    }

    if (initialDate > finalDate) {
      this._toastService.showToastError("Data Final não pode ser menor que Data Inicial!");
      return;
    }

    if (initialDate instanceof Date && initialDate.getFullYear() !== currentYear) {
      try {
        const orders = await this._requestHandlerService.getOrdersFromDate(initialDate, finalDate);
        this.defaultOrders = orders;
        this.filteredOrders = this.defaultOrders;
      } catch (error) {
        this._requestHandlerService.handleError(error);
      }
    }
  }

  formatDate(date: Date | undefined): string {
    if (date) {
      return this._requestHandlerService.formatDate(new Date(date));
    }
    return '';
  }


}

export interface DropdownOption {
  description?: string;
  url?: string;
  queryParam?: {};
  target?: string;
  consumerName?: string;
}

export interface HoverContentOption {
  orderId?: number;
  consumerName?: string;
  engineBlockNumberImage?: string;
}



