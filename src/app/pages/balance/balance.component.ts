import { Component, ViewChild } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Consumer } from '../../services/consumer.entity';
import { DialogConsumerSearchComponent } from '../../components/dialog-consumer-search/dialog-consumer-search.component';
import { Balance } from '../../services/balance.entity';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RequestHandlerService } from '../../services/request-handler.service';
import { ToastService } from '../../services/toast.service';
import { DropdownOption } from '../../components/list-orders-handler/list-orders-handler.component';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [FooterComponent, PageTitleComponent, NavbarComponent, FormsModule, CommonModule, DialogConsumerSearchComponent, RouterLink],
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css', '../../../global.css'],
})
export class BalanceComponent {

  @ViewChild(DialogConsumerSearchComponent)
  dialogConsumerSearchComponent!: DialogConsumerSearchComponent;

  filterByConsumerName: string = "";
  filterByMonth: number = 0;
  filterByYear: number = new Date().getFullYear();
  yearsLoaded: number[] = [new Date().getFullYear()];
  filterIsPaid: string = "all";
  filterTotalOfMonths: string = "no";

  isDropdownVisible: boolean = false;
  dropdownPosition: { left: number, top: number } = { left: 0, top: 0 };
  dropdownOptions: DropdownOption[] = [];

  defaultBalances: Balance[] = [];
  filteredBalances: Balance[]  = [];
  balancesByMonth!: MonthGroup[];

  idOfEditingDescription!: number;
  editingDescription!: string;


  months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  constructor(private _route: ActivatedRoute, private _requestHandlerService: RequestHandlerService, private _toastService: ToastService) {

  }

  async ngOnInit() {
    this.defaultBalances = await this._requestHandlerService.getBalancesByYear(this.filterByYear);
    await this.filter();
  }

  async filter(): Promise<void> {

    const consumerCondition = (b: Balance) =>
      !this.filterByConsumerName ||
      (b.consumer?.name &&
        this.normalize(b.consumer.name).includes(this.normalize(this.filterByConsumerName)));

    const monthCondition = (b: Balance) => {
      if (!this.filterByMonth) return true;
      if (!b.date) return false;

      return (new Date(b.date).getMonth() + 1) === this.filterByMonth;
    };

    const yearCondition = (b: Balance) => {
      if (!this.filterByYear) return true;
      if (!b.date) return false;

      return new Date(b.date).getFullYear() === this.filterByYear;
    };

    const paidCondition = (b: Balance) => {
      if (this.filterIsPaid === "all") return true;
      if (this.filterIsPaid === "yes") return b.isPaid === true;
      if (this.filterIsPaid === "no") return b.isPaid === false;
      return true;
    };

    this.filteredBalances = [...this.defaultBalances]
      .filter(b =>
        consumerCondition(b) &&
        monthCondition(b) &&
        yearCondition(b) &&
        paidCondition(b)
      )
      .sort((a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );

    this.balancesByMonth = this.filterBalancesByMonth();
  }

  async addYearToFilter(): Promise<void> {
    if (this.filterByYear) {
      if (this.yearsLoaded.includes(this.filterByYear)) return;
      else {
        const result = await this._requestHandlerService.getBalancesByYear(this.filterByYear);
        this.defaultBalances.push(...result);
        this.yearsLoaded.push(this.filterByYear);
      }
    }
  }



  getConsumerFromChildAndSendToParent(consumer: Consumer): void {
    this.filterByConsumerName = consumer.name!;
    this.filter();
  }

  filterBalancesByMonth(): MonthGroup[] {
    const result: MonthGroup[] = [];

    this.months.forEach(m => {
      const items = this.filteredBalances.filter(b => {
        if (!b.date) return false;
        return new Date(b.date).getMonth() + 1 === m.value;
      });

      if (items.length === 0) return;

      result.push({
        month: m.value,
        label: m.label,
        items: items.sort((a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        ),
        total: items.reduce((sum, i) => sum + (i.priceTotal ?? 0), 0)
      });
    });

    return result.reverse(); // Dezembro → Janeiro
  }

  showDropdown(event: MouseEvent, data: Balance | Consumer | undefined, field: string): void {

    this.isDropdownVisible = true;
    this.calculateDropdownPosition(event);

    if (data) {
      this.dropdownOptions = [];

      switch (field) {
        case "id":
          this.idBalanceDropdownOptions(data);
          break;
        case "consumer":
          this.consumerDropDownOptions(data);
          break;
        case "description":
          this.descriptionBalanceDropdownOptions(data);
          break;
        case "paid":
          this.isPaidBalanceDropdownOptions(data);
          break;

        default:
          break;
      }

    }
  }

  idBalanceDropdownOptions(balance: Balance) {
    const queryParam = { balanceId: balance.id };
    this.dropdownOptions = [
      { description: "Imprimir", url: "/balance", queryParam, target: "_blank", type: 'internal' },
      { description: "Editar", url: "/list-orders", queryParam, target: "_self", type: 'internal' },
    ]
  }

  consumerDropDownOptions(consumer: Consumer) {

    const queryParam = { consumerId: consumer.id };

    this.dropdownOptions = [
      {
        description: "Listar Fechamentos", consumerName: consumer.name, type: 'bind', action: () => {
          this.filterByConsumerName = consumer.name ? consumer.name : "";
          this.filter();
        }
      },
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

  descriptionBalanceDropdownOptions(balance: Balance) {
    this.dropdownOptions = [
      { description: "Editar Descrição", type: 'bind', action: () => this.editDescription(balance) }]
  }

  isPaidBalanceDropdownOptions(balance: Balance) { // TO DO SET PAID BALANCE
    this.dropdownOptions = [
      { description: "Confirmar Baixa!", type: 'bind', action: () => this.setPaidBalance(balance) }]
  }

  async setPaidBalance(balance: Balance): Promise<void> {
    const result = await this._requestHandlerService.setPaidBalance(balance);
    if (result) {
      this._toastService.showToastSuccess("Fechamento salvo como pago com sucesso!")
      const localBalance = this.defaultBalances.find(b => b.id == balance.id);
      if (localBalance) localBalance.isPaid = true
      this.filter();
    }else { this._toastService.showToastError("Fechamento não salvo como pago!") }
  }

  editDescription(balance: Balance): void {
    this.idOfEditingDescription = balance.id ?? -1;
    this.editingDescription = balance.description ?? "";
  }

  async saveNewDescriptionOfBalance(): Promise<void> {
  if (
    this.idOfEditingDescription &&
    this.idOfEditingDescription > 0 &&
    this.editingDescription?.length > 1
  ) {

    const balance = this.defaultBalances.find(
      b => b.id === this.idOfEditingDescription
    );

    if (balance) {

      const result = await this._requestHandlerService.putBalance(balance);

      if (result) {
        balance.description = this.editingDescription;

        this._toastService.showToastSuccess(
          "Descrição do Fechamento N°" + this.idOfEditingDescription + " editada com sucesso!"
        );

        this.resetDescriptionEditing();
      }
    }
  }
  this.filter();
}

  resetDescriptionEditing(): void {
    this.idOfEditingDescription = -1;
    this.editingDescription = "";
  }

  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private buildWhatsappLink(phone: string): string | null {

    const normalized = this.normalizePhone(phone);

    if (!normalized) return null;

    return `https://wa.me/55${normalized}`;
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

  calculateDropdownPosition(event: MouseEvent) {
    this.dropdownPosition = {
      left: event.clientX - 10,
      top: event.clientY - 10
    };
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  openSearchDialog(): void {
    this.dialogConsumerSearchComponent.openModal();
  }

}

type MonthGroup = {
  month: number;
  label: string;
  items: Balance[];
  total: number;
};