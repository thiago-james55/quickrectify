import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ListOrdersHandlerComponent } from "../../components/list-orders-handler/list-orders-handler.component";

@Component({
    selector: 'app-list-orders',
    standalone: true,
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.css', '../../../global.css'],
    imports: [NavbarComponent, PageTitleComponent, FooterComponent, ListOrdersHandlerComponent]
})
export class ListOrdersComponent {

}
