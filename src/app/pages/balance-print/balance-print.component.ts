import { CompanyInfoService } from './../../services/company-info.service';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../services/order.entity';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NoCommaPipe } from "../../pipes/no-comma.pipe";
import { RequestHandlerService } from '../../services/request-handler.service';
import { Balance } from '../../services/balance.entity';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-balance-print',
  standalone: true,
  imports: [CommonModule, NoCommaPipe],
  templateUrl: './balance-print.component.html',
  styleUrls: ['./balance-print.component.css', '../../../global.css'],
})
export class BalancePrintComponent {

  print(): void { window.print(); }

  constructor(
    private _route: ActivatedRoute,
    private _toastService: ToastService,
    private _requestHandlerService: RequestHandlerService,
    public _companyInfo: CompanyInfoService,
  ) {
    this.loadBalanceInfo();
  }

  balance: Balance = {} as Balance;
  orders: Order[] = [];

  async loadBalanceInfo(): Promise<void> {

    const balanceId = await this._route.snapshot.queryParamMap.get('balanceId') ?? undefined;
    if (balanceId != null) {
      this.balance = await this._requestHandlerService.getBalanceById(parseInt(balanceId));
      this.orders = await this._requestHandlerService.getBalanceOrders(parseInt(balanceId))
    } else {
      this._toastService.showToastError("Sem Query Param!");
    }

  }

  async saveAsJpg() {
  const element = document.body;

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const link = document.createElement('a');
  link.download = "Fechamento N°(" + this.balance.id + ") - " + this.balance.consumer?.name + " Total R$" + this.balance.priceTotal?.toFixed(2)  ;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}


  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) { this.saveAsJpg(); }

}
