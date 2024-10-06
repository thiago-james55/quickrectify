import { CompanyInfoService } from './../../services/company-info.service';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../services/order.entity';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NoCommaPipe } from "../../pipes/no-comma.pipe";
import { RequestHandlerService } from '../../services/request-handler.service';
import { VacationInfoData } from '../configuration/configuration.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-note',
  standalone: true,
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css', '../../../global.css'],
  imports: [CommonModule, NoCommaPipe]
})
export class NoteComponent {

  print():void { window.print(); }

  isVacationInfo: boolean = false;
  vacationInfoData: VacationInfoData = {};

  constructor(
    private _route: ActivatedRoute,
    private _toastService: ToastService,
    private _requestHandlerService: RequestHandlerService,
    public _companyInfo: CompanyInfoService,
    private _storageService: StorageService
  ) { 
    this.loadNoteInfo();
  }

  order: Order = { parts: [] };
  installments: number[] = [];


  loadNoteInfo(): void {
    this.getOrder();
    this.getVacationInfo();
  }

  getOrder(): void {

    const orderId = this._route.snapshot.queryParamMap.get('orderId');

    if (orderId) this.getOrderByService(orderId);
    else this._toastService.showToastError('No orderId in query params');

  }

  async getOrderByService(orderId: string): Promise<void> {
    this.order = await this._requestHandlerService.getOrderById(Number.parseInt(orderId));
    await this.sumInstallments();
  }

  async sumInstallments(): Promise<void> {

    if (!this.order || !this.order.priceTotal) return;

    let feesTotal: number = this.order.priceTotal;

    this.installments[0] = feesTotal;

    for (let index = 1; index < 12; index++) {
      feesTotal += ((feesTotal / 100) * this._companyInfo.paymentFee);
      const installment: number = feesTotal;
      this.installments[index] = installment / (index + 1);
    }

  }

  async getVacationInfo(): Promise<void> {
    const savedvacationInfoData = this._storageService.getItem("vacationInfoData");

    if (savedvacationInfoData !== null) {
      this.vacationInfoData = JSON.parse(savedvacationInfoData) as VacationInfoData;
      this.isVacationInfo = true;
  }

 }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) { window.print(); }

}
