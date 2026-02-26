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

  page: number = 1;
  pageSize: number = 100;
  haveNextPage: boolean = true;
  isLoadingOrders: boolean = false;

  filteredByDate: boolean = false;

  filterByOrderNumber!: number;
  filterByConsumerName!: string;
  filterByDescription!: string;
  filterByPart: string = "all";
  filterByInitialDate!: string;
  lastFilterByInitialDate!: string;
  filterByFinalDate!: string;
  lastFilterByFinalDate!: string;
  filterTotalOfOrder: string = "yes";
  filterTotalOfSelection: string = "no";
  filterIsPartPaid: string = "all";

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

      await this.loadOrders();
      this.filteredOrders = this.defaultOrders;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    this.setDates();
  }

  async loadOrders(reseting: boolean = false): Promise<void> {
    if (this.isLoadingOrders) return;
    this.isLoadingOrders = true;

    if (!this.haveNextPage) return;

    try {
      const result = await this._requestHandlerService.getOrdersOfThisYear(this.page, this.pageSize);

      if (result.items && result.items.length > 0) {

        if (reseting) {
          this.defaultOrders = [...result.items];
        } else {
          this.defaultOrders.push(...result.items);
        }

        this.page++;
        this.haveNextPage = result.haveNextPage;
      } else {
        this.haveNextPage = false;
      }

    } catch (error) {
      this._requestHandlerService.handleError(error);
    }
    await this.filter();
    this.isLoadingOrders = false;
  }


  setDates(): void {
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();
    this.filterByInitialDate = firstDayOfYear.toISOString().split('T')[0];
    this.filterByFinalDate = today.toISOString().split('T')[0];
    this.setLastDates();
  }

  setLastDates() {
    this.lastFilterByInitialDate = this.filterByInitialDate;
    this.lastFilterByFinalDate = this.filterByFinalDate;
  }


  async filter(): Promise<void> {

    await this.checkFilterIsForCurrentYear();

    const orderNumberCondition = (order: Order) => (
      !this.filterByOrderNumber || (order.id == this.filterByOrderNumber)
    );

    const consumerCondition = (order: Order) => (
      !this.filterByConsumerName || (
        order.consumer?.name && this.normalize(order.consumer.name).includes(this.normalize(this.filterByConsumerName))
      )
    );

    const descriptionCondition = (order: Order) => (
      !this.filterByDescription || (
        order.parts && order.parts.some(part => part.description?.toLowerCase().includes(this.filterByDescription.toLowerCase()))
      )
    );

    const dateCondition = (order: Order) => {
      const finalDate = this.finalDateToEndOfDay();

      return (
        (!this.filterByInitialDate || order.date! >= new Date(this.filterByInitialDate)) &&
        (!this.filterByFinalDate || order.date! <= finalDate!)
      );
    };


    let orderPartCondition = (order: Order) => (
      !this.filterByPart || (
        order.parts && order.parts.some(part => part.name.toLowerCase().includes(this.filterByPart.toLowerCase()))
      )
    );

    let partPaidCondition = (order: Order) =>
      !this.filterIsPartPaid || (
        order.parts && order.parts.some(part => part.isPaid === (this.filterIsPartPaid === "yes"))
      );

    if (this.filterByPart.toLocaleLowerCase().includes("all")) orderPartCondition = () => true;
    if (this.filterIsPartPaid.toLocaleLowerCase().includes("all")) partPaidCondition = () => true;


    const predicates = [orderNumberCondition, consumerCondition, descriptionCondition, dateCondition, orderPartCondition, partPaidCondition];


    if (this.defaultOrders) {
      this.filteredOrders = this.defaultOrders.filter(order =>
        predicates.every(predicate => predicate(order))
      );
    }
  }

  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
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

  async showHover(event: MouseEvent, order: Order | undefined): Promise<void> {

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
    ];

    const phoneProperties: (keyof Consumer)[] = ['phone1', 'phone2', 'phone3'];

    phoneProperties.forEach((property, index) => {

      const phone = consumer[property];

      if (!phone) return;

      const whatsappLink = this.buildWhatsappLink(phone.toString());

      if (!whatsappLink) return;

      this.dropdownOptions.push({
        description: `Tel (${index + 1}): ${phone}`,
        url: whatsappLink,
        target: "_blank"
      });
    });
  }

  private normalizePhone(rawPhone: string): string | null {

    if (!rawPhone) return null;

    let numbers = rawPhone.replace(/\D/g, '');

    if (numbers.startsWith('55') && numbers.length > 11) {
      numbers = numbers.substring(2);
    }

    if (numbers.length === 8 || numbers.length === 9) {
      numbers = '11' + numbers; // adiciona DDD padrão
    }

    if (numbers.length !== 10 && numbers.length !== 11) {
      return null; // número inválido
    }

    return numbers;
  }

  private buildWhatsappLink(phone: string): string | null {

    const normalized = this.normalizePhone(phone);

    if (!normalized) return null;

    return `https://wa.me/55${normalized}`;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  hideHover() {
    this.isHoverVisible = false;
  }

  calculateDropdownPosition(event: MouseEvent) {
    this.dropdownPosition = {
      left: event.clientX - 10,
      top: event.clientY - 10
    };
  }

  async checkFilterIsForCurrentYear(): Promise<void> {
    if (!this.filterByInitialDate || (this.lastFilterByInitialDate === this.filterByInitialDate && this.lastFilterByFinalDate === this.filterByFinalDate)) return;

    const currentYear = new Date().getFullYear();
    const initialDate = new Date(this.filterByInitialDate);

    const finalDate = this.finalDateToEndOfDay();

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

    const [initYear, initMonth, initDay] = this.filterByInitialDate.split('-').map(Number);
    const [finalYear, finalMonth, finalDay] = this.filterByFinalDate.split('-').map(Number);

    const localInitialDate = new Date(initYear, initMonth - 1, initDay); // mês 0-index
    const localFinalDate = new Date(finalYear, finalMonth - 1, finalDay);

    if (localInitialDate.getFullYear() === currentYear && localFinalDate.getFullYear() === currentYear) {
      this.resetPagination();
      this.setLastDates();
      return;
    }

    if (initialDate instanceof Date && initialDate.getFullYear() !== currentYear) {
      try {
        const orders = await this._requestHandlerService.getOrdersFromDate(initialDate, finalDate);
        this.defaultOrders = orders;
        this.filteredOrders = this.defaultOrders;
        this.setLastDates();
        this.filteredByDate = true;
      } catch (error) {
        this._requestHandlerService.handleError(error);
      }
    }
  }

  resetPagination() {
    this.page = 1;
    this.pageSize = 100;
    this.haveNextPage = true;
    this.loadOrders(true);
    this.filteredByDate = false;
  }

  finalDateToEndOfDay(): Date {
    const finalDate = this.filterByFinalDate ? new Date(this.filterByFinalDate) : new Date();
    finalDate.setUTCHours(23, 59, 59, 999);
    return finalDate;
  }


  formatDate(date: Date | undefined): string {
    if (date) {
      return this._requestHandlerService.formatDate(new Date(date));
    }
    return '';
  }

  checkAllPartsOfOrderIsPaid(order: Order): boolean {
    return order.parts.every(e => e.isPaid);
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



