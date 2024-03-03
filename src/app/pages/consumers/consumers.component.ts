import { Component } from '@angular/core';
import { ConsumerHandlerComponent } from "../../components/consumer-handler/consumer-handler.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Consumer } from '../../services/consumer.entity';
import { ActivatedRoute } from '@angular/router';
import { RequestHandlerService } from '../../services/request-handler.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-consumers',
    standalone: true,
    templateUrl: './consumers.component.html',
    styleUrls: ['./consumers.component.css', '../../../global.css'],
    imports: [ConsumerHandlerComponent, PageTitleComponent, FooterComponent, NavbarComponent]
})
export class ConsumersComponent {

    consumer: Consumer = {};

    constructor(private _route: ActivatedRoute, private _requestHandlerService: RequestHandlerService, private _toastService: ToastService) { }

    ngOnInit() { this.checkQueryParam() }

    async getConsumer(consumerId: number): Promise<void> {
        this.consumer = await this._requestHandlerService.getConsumerById(consumerId);
    }

    checkQueryParam() {
        const param = this._route.snapshot.queryParamMap.get('consumerId');
        if (param) {
            const consumerId = parseInt(param);

            if (!isNaN(consumerId)) this.getConsumer(consumerId);
            else this._toastService.showToastError('Consumer Id Invalido');
        }
    }

}
