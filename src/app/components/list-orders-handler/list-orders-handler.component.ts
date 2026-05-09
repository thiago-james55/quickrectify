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
import { Balance } from '../../services/balance.entity';
import { SimpleBalance } from '../../services/simple-balance.entity';

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

  balance: Balance = {} as Balance;
  defaultOrders: Order[] = [];
  filteredOrders: Order[] = [];

  page: number = 1;
  pageSize: number = 100;
  haveNextPage: boolean = true;
  isLoadingOrders: boolean = false;
  isBalancePage: boolean = false;

  filteredByDate: boolean = false;

  consumer?: Consumer;

  filterByOrderNumber?: number;
  filterByConsumerName!: string;
  filterByDescription!: string;
  filterByGroup: string = "all";
  filterByInitialDate!: string;
  lastFilterByInitialDate!: string;
  filterByFinalDate!: string;
  lastFilterByFinalDate!: string;
  filterTotalOfOrder: string = "yes";
  filterTotalOfSelection: string = "no";
  filterIsPartPaid: string = "all";

  filterByInitialOrder?: number;
  filterByFinalOrder?: number;
  excludeOrderFromFilter: number[] = [];
  excludeOrderFromFilterText: string = "";


  public readonly ORDER_ENGINEBLOCKNUMBERIMAGE_URL: string;
  lastOrderId: number = 0;

  constructor(private _route: ActivatedRoute, private _requestHandlerService: RequestHandlerService, private _toastService: ToastService) {
    this.filteredOrders = this.defaultOrders;
    this.ORDER_ENGINEBLOCKNUMBERIMAGE_URL = _requestHandlerService.ORDER_ENGINEBLOCKNUMBERIMAGE_URL;
  }

  async ngOnInit() {
    try {
      await this.loadOrders();
      await this.filter();
      await this.loadDefaultParts();

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    this.setDates();
  }

  async loadOrders(reseting: boolean = false): Promise<void> {
    if (this.isLoadingOrders) return;

    if (await this.changeToBalancePage()) return;

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

  async changeToBalancePage(): Promise<boolean> {

    if (!this.balance.id) {
      const balanceId = await this._route.snapshot.queryParamMap.get('balanceId') ?? undefined;
      if (balanceId != null) {
        this.isBalancePage = true;
        this.balance = await this._requestHandlerService.getBalanceById(parseInt(balanceId));
      } else {
        return false;
      }
    }

    if (this.balance.id) {
      await this.setBalanceInfo(
        this.balance.consumer?.name,
        this.balance.initialOrder,
        this.balance.finalOrder,
        this.balance.excludedOrders
      )
      this.isLoadingOrders = true;
      this.filterTotalOfOrder = "no";
      this.filterTotalOfSelection = "yes"
      this.isLoadingOrders = false;
      this.defaultOrders = [... await this._requestHandlerService.getBalanceOrders(this.balance.id)];
      return true;
    } else {
      return false;
    }
  }

  async resetOrdersFromBalance(): Promise<void> {
    window.location.href = window.location.pathname;
  }

  private async loadDefaultParts(): Promise<void> {
    this.defaultParts = await this._requestHandlerService.getDefaultParts();
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

  async setPaidAllOrdersOfTheFilter(): Promise<void> {

    if (!this.checkFilterInformation()) return;

    var success = false;

    if (this.balance.id) {
      if (await this._requestHandlerService.setPaidBalance(this.balance)) {
        this._toastService.showToastSuccess("Fechamento salvo como pago com sucesso!");
        success = true;
      } else {
        this._toastService.showToastError("Fechamento não salvo como pago!");
      }
    } else {
      const consumerName = this.filterByConsumerName;
      const ids: number[] = this.filteredOrders
        .map(o => o.id)
        .filter((id): id is number => id !== undefined);

      if (consumerName && ids) {
        const consumerId = this.filteredOrders.find(o => o.consumer?.name?.toLocaleLowerCase() === consumerName.toLowerCase())?.consumerId;
        if (consumerId) {
          const simpleBalance: SimpleBalance = { consumerId: consumerId, orderIds: ids }
          if (await this._requestHandlerService.setPaidAllOrdersOfTheFilter(simpleBalance)) {
            this._toastService.showToastSuccess("Ordens salvas como pagas com sucesso!");
            success = true;
          }
          else {
            this._toastService.showToastError("Ordens não salvas como pagas!")
          }
        }
      }
    }

    if (!success) return;

    const defaultMap = new Map(this.defaultOrders.map(o => [o.id, o]));

    this.filteredOrders.forEach(order => {
      order.parts?.forEach(part => part.isPaid = true);

      const defaultOrder = defaultMap.get(order.id);
      defaultOrder?.parts?.forEach(part => part.isPaid = true);
    });
  }

  checkFilterInformation() {

    const filterName = this.filterByConsumerName?.toLowerCase();

    if (!filterName) {
      this._toastService.showToastError("O nome do cliente não pode estar vazio!");
      return false;
    }

    if (this.filteredOrders.length <= 1) {
      this._toastService.showToastError("Um fechamento precisa ter mais de 1 OS");
      return;
    }

    this.filterByInitialOrder = this.filterByInitialOrder ? this.filterByInitialOrder : this.filteredOrders[this.filteredOrders.length - 1]?.id;
    this.filterByFinalOrder = this.filterByFinalOrder ? this.filterByFinalOrder : this.filteredOrders[0]?.id;

    if ((this.filterByInitialOrder && this.filterByFinalOrder) && (this.filterByInitialOrder > this.filterByFinalOrder)) {
      this._toastService.showToastError("Os inicial não poder ser maior que OS final!");
      return;
    }

    const allMatch = this.filteredOrders.every(order =>
      (order.consumer?.name ?? '').toLowerCase() === filterName
    );

    if (!allMatch) {
      this._toastService.showToastError(
        "O nome do cliente precisa ser EXATAMENTE IGUAL ao salvo nas orders de serviço!"
      );
      return false;
    }
    return true;
  }

  async saveBalance(): Promise<void> {
    if (!this.checkFilterInformation()) return;

    const consumerId = this.filteredOrders.find(o => o.consumer?.name?.toLowerCase())?.consumerId;

    if (this.balance.id) {
      this.balance.initialOrder = this.filterByInitialOrder,
        this.balance.finalOrder = this.filterByFinalOrder,
        this.balance.excludedOrders = this.excludeOrderFromFilter,
        this.balance.consumerId = consumerId,
        this.balance.priceTotal = parseInt(this.getTotalOfFilteredOrders())
      if (await this._requestHandlerService.putBalance(this.balance)) {
        this._toastService.showToastSuccess(`Fechamento (${this.balance.id}) editado com sucesso!`);
      }
      else {
        this._toastService.showToastError("Erro ao editar Fechamento!");
      }
    }
    else {
      const balance: Balance = {
        initialOrder: this.filterByInitialOrder,
        finalOrder: this.filterByFinalOrder,
        excludedOrders: this.excludeOrderFromFilter,
        consumerId: consumerId,
        priceTotal: parseInt(this.getTotalOfFilteredOrders())
      };

      const balanceId = await this._requestHandlerService.postBalance(balance);
      if (balanceId) {
        this._toastService.showToastSuccess(`Fechamento (${balanceId}) salvo com sucesso!`);
        this.isBalancePage = true;
        this.changeToBalancePage();
      } else {
        this._toastService.showToastError("Erro ao salvar Fechamento!");
      }
    }

  }

  async filter(): Promise<void> {

    await this.checkFilterIsForCurrentYear();

    const orderNumberCondition = (order: Order) => (
      !this.filterByOrderNumber || (order.id == this.filterByOrderNumber)
    );

    const initialOrderNumberCondition = (order: Order) =>
      !this.filterByInitialOrder || (order.id ?? -Infinity) >= this.filterByInitialOrder;

    const finalOrderNumberCondition = (order: Order) =>
      !this.filterByFinalOrder || (order.id ?? Infinity) <= this.filterByFinalOrder;

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
      !this.filterByGroup || (
        order.parts && order.parts.some(part => part.name.toLowerCase().includes(this.filterByGroup.toLowerCase()))
      )
    );

    let partPaidCondition = (order: Order) =>
      !this.filterIsPartPaid || (
        order.parts && order.parts.some(part => part.isPaid === (this.filterIsPartPaid === "yes"))
      );

    if (this.filterByGroup.toLocaleLowerCase().includes("all")) orderPartCondition = () => true;
    if (this.filterIsPartPaid.toLocaleLowerCase().includes("all")) partPaidCondition = () => true;


    const predicates = [orderNumberCondition, initialOrderNumberCondition, finalOrderNumberCondition, consumerCondition, descriptionCondition, dateCondition, orderPartCondition, partPaidCondition];


    if (this.defaultOrders) {
      this.filteredOrders = this.defaultOrders.filter(order =>
        predicates.every(predicate => predicate(order))
      );
    }
  }

  async addOrderIdToExclude(orderId?: number, ordersId?: number[]): Promise<void> {
    if (orderId == undefined && ordersId == undefined) return;

    if (orderId) {
      const isInFilter = this.excludeOrderFromFilter.includes(orderId);

      if (!isInFilter) {
        this.excludeOrderFromFilter.push(orderId);
      } else {
        this.excludeOrderFromFilter = this.excludeOrderFromFilter.filter(x => x !== orderId);
      }
    } else if (ordersId) this.excludeOrderFromFilter = [...ordersId]

    this.excludeOrderFromFilter.sort((a, b) => a - b);
    this.excludeOrderFromFilterText = this.excludeOrderFromFilter.join(',');

    await this.filter();
  }

  isExcluded(orderId?: number): boolean {
    return this.excludeOrderFromFilter.includes(orderId ?? -1);
  }

  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async setBalanceInfo(consumerName?: string, initialOrder?: string | number, finalOrder?: string | number, excludedOrders?: number[]): Promise<void> {
    if (consumerName) this.filterByConsumerName = consumerName;
    if (initialOrder) this.filterByInitialOrder = Number(initialOrder);
    if (finalOrder) this.filterByFinalOrder = Number(finalOrder);
    if (excludedOrders) await this.addOrderIdToExclude(undefined, excludedOrders);
    await this.filter();
  }

  openSearchDialog(): void {
    this.dialogConsumerSearchComponent.openModal();
  }

  getConsumerFromChildAndSendToParent(consumer: Consumer): void {
    this.consumer = consumer;
    this.filterByConsumerName = this.consumer.name!;
    this.filter();
  }


  getTotalOfFilteredOrders(): string {
    return this.filteredOrders
      .filter(o => !this.excludeOrderFromFilter.includes(o.id ?? -1))
      .map(o => o.priceTotal ?? 0)
      .reduce((sum, current) => sum + current, 0)
      .toFixed(2);
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
      { description: "2° Via", url: "/note", queryParam, target: "_blank", type: 'internal' },
      { description: "Editar", url: "/new-order", queryParam, target: "_self", type: 'internal' },
      { description: "Os Inicial", type: 'bind', action: () => this.setBalanceInfo(undefined, order.id, undefined) },
      { description: "Os Final", type: 'bind', action: () => this.setBalanceInfo(undefined, undefined, order.id) },
      { description: this.excludeOrderFromFilter.includes(order.id ?? -1) ? "Readicionar OS no Filtro" : "Excluir OS do Filtro", type: 'bind', action: () => this.addOrderIdToExclude(order.id) },
    ]
  }

  consumerDropDownOptions(consumer: Consumer) {

    const queryParam = { consumerId: consumer.id };

    this.dropdownOptions = [
      { description: "Listar Ordens", consumerName: consumer.name, type: 'bind', action: () => this.setBalanceInfo(consumer.name) },
      { description: "Ver/Editar Cliente", url: "/consumers", queryParam, target: "_self", type: 'internal' }
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
        target: "_blank",
        type: 'external'
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
  type: DropdownOptionType;
  url?: string;
  queryParam?: {};
  target?: string;
  consumerName?: string;
  action?: () => void;
}

type DropdownOptionType = 'internal' | 'external' | 'bind';

export interface HoverContentOption {
  orderId?: number;
  consumerName?: string;
  engineBlockNumberImage?: string;
}