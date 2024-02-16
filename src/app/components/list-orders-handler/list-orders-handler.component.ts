import { Component, ViewChild } from '@angular/core';
import { Part} from '../../services/part.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consumer } from '../../services/consumer.entity';
import { DialogConsumerSearchComponent } from "../dialog-consumer-search/dialog-consumer-search.component";
import { Order } from '../../services/order.entity';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RequestHandlerService } from '../../services/request-handler.service';

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
  
  @ViewChild(DialogConsumerSearchComponent)
  dialogConsumerSearchComponent!: DialogConsumerSearchComponent;
  
  defaultParts: Part[] = this._requestHandlerService.getDefaultParts();
  
  defaultOrders: Order[] = this._requestHandlerService.generateMockOrders();
  filteredOrders: Order[] = [];
  
  filterByConsumerName!: string;
  filterByPart: string = "all";
  filterByInitialDate!: Date;
  filterByFinalDate!: Date;
  
  constructor(private _route: ActivatedRoute, private _requestHandlerService: RequestHandlerService) {
    this.filteredOrders = this.defaultOrders;
  }

  ngOnInit() {
    const consumerName = this._route.snapshot.queryParamMap.get('consumerName');
    if (consumerName) this.setConsumerName(consumerName);
  }


  filter(): void {

    const dateCondition = (order: Order) => (
      (!this.filterByInitialDate || order.date! >= new Date(this.filterByInitialDate)) &&
      (!this.filterByFinalDate || order.date! <= new Date(this.filterByFinalDate))
    );

    const consumerCondition = (order: Order) => (
      !this.filterByConsumerName || (
        order.consumer && order.consumer.name!.toLowerCase().includes(this.filterByConsumerName.toLowerCase())
      )
    );

    let orderPartCondition = (order: Order) => (
      !this.filterByPart || (
        order.parts && order.parts.some(part => part.name.toLowerCase().includes(this.filterByPart.toLowerCase()))
      )
    );


    if (this.filterByPart.toLocaleLowerCase().includes("all")) orderPartCondition = () => true;

    const predicates = [dateCondition, consumerCondition, orderPartCondition];

    this.filteredOrders = this.defaultOrders.filter(order =>
      predicates.every(predicate => predicate(order))
    );
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

  calculateDropdownPosition(event: MouseEvent) {
    this.dropdownPosition = {
      left: event.clientX - 10,
      top: event.clientY - 10
    };
  }
}

export interface DropdownOption {
  description?: string;
  url?: string;
  queryParam?: {};
  target?: string;
  consumerName?: string;
}