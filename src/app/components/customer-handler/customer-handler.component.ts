import { DialogCustomerSearchComponent } from './../dialog-customer-search/dialog-customer-search.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Customer } from '../../service/model/Customer.entity';
import { DialogCustomerCreateComponent } from '../dialog-customer-create/dialog-customer-create.component';


@Component({
    selector: 'app-customer-handler',
    standalone: true,
    templateUrl: './customer-handler.component.html',
    styleUrls: ['./customer-handler.component.css', '../../../global.css'],
    imports: [CommonModule, DialogCustomerSearchComponent, DialogCustomerCreateComponent]
})
export class CustomerHandlerComponent {

  @ViewChild(DialogCustomerSearchComponent)
  dialogCustomerSearchComponent!: DialogCustomerSearchComponent;

  @ViewChild(DialogCustomerCreateComponent)
  dialogCustomerCreateComponent!: DialogCustomerCreateComponent;

  @Input() table: boolean = false;

  customer: Customer = {};
  
  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  openSearchDialog(): void {
    this.dialogCustomerSearchComponent.openModal();
  }

  openCreateDialog(): void {
    this.dialogCustomerCreateComponent.openModal();
  }

  getCustomerFromChildAndSendToParent(customer: Customer): void {
    this.customer = { ...customer };
    this.objectSentToParent.emit(customer);
    console.log("Object from child:  " + JSON.stringify(customer))
  }

}
