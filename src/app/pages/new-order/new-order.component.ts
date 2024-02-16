import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { OrderHandlerComponent } from "../../components/order-handler/order-handler.component";
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../services/order.entity';

@Component({
  selector: 'app-new-order',
  standalone: true,
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css', '../../../global.css'],
  imports: [NavbarComponent, FooterComponent, PageTitleComponent, OrderHandlerComponent]
})
export class NewOrderComponent {

  constructor(
    private _route: ActivatedRoute,
    private _toastService: ToastService,
  ) { }

  order: Order = { parts: [] };

  ngOnInit() {
    const orderId = this._route.snapshot.queryParamMap.get('orderId');
    if (orderId) this.getOrder(orderId);
  }

  getOrder(orderId: string): void {

    if (orderId) {

      //
      const storedOrderData = localStorage.getItem(orderId);

      if (storedOrderData) {
        this.order = JSON.parse(storedOrderData) as Order;
      } else {
        //Service of services of HTTP methods =  GET
      }
    } else {
      this._toastService.showToastError('No orderId in query params');
    }
  }

}
