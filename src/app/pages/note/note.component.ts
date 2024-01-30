import { CompanyInfoService } from './../../services/company-info.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../services/order.entity';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NoCommaPipe } from "../../pipes/no-comma.pipe";

@Component({
    selector: 'app-note',
    standalone: true,
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.css', '../../../global.css'],
    imports: [CommonModule, NoCommaPipe]
})
export class NoteComponent {

  constructor(
    private _route: ActivatedRoute,
    private _toastService: ToastService,
    public _companyInfo:CompanyInfoService
    ){}

  order: Order = { orderParts: [] };


  ngOnInit() { this.getOrder(); }

  getOrder(): void {
    const orderId = this._route.snapshot.queryParamMap.get('orderId');

    if (orderId) {

      const storedOrderData = localStorage.getItem(orderId);

      if (storedOrderData) {
        this.order = JSON.parse(storedOrderData) as Order;
      } else {
        this.getOrderByService(orderId);
      }
    } else {
      this._toastService.showToastError('No orderId in query params');
    }
  }

  getOrderByService(orderId: string): void {
    //service.getOrder();
  }

}
