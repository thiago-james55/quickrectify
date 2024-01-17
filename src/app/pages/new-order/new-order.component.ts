import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { OrderHandlerComponent } from "../../components/order-handler/order-handler.component";

@Component({
    selector: 'app-new-order',
    standalone: true,
    templateUrl: './new-order.component.html',
    styleUrls: ['./new-order.component.css', '../../../global.css'],
    imports: [NavbarComponent, FooterComponent, PageTitleComponent, OrderHandlerComponent]
})
export class NewOrderComponent {

}
