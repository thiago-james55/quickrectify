import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { OrderHandlerComponent } from "../../components/order-handler/order-handler.component";
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../services/order.entity';
import { RequestHandlerService } from '../../services/request-handler.service';

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
    private _requestHandlerService: RequestHandlerService
  ) { }

  order: Order = { parts: [] };

  ngOnInit() {
    const orderId = this._route.snapshot.queryParamMap.get('orderId');
    if (orderId) this.getOrder(orderId);
  }

  async getOrder(orderId: string): Promise<void> {

    if (orderId) {
        this.order = await this._requestHandlerService.getOrderById(Number.parseInt(orderId));
    } else {
      this._toastService.showToastError('No orderId in query params');
    }
  }

}
