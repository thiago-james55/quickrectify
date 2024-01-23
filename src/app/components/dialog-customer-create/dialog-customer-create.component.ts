import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Customer } from '../../service/model/Customer.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-customer-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-customer-create.component.html',
  styleUrls: ['./dialog-customer-create.component.css', '../../../global.css']
})
export class DialogCustomerCreateComponent {

  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

  customer: Customer = {};

  @ViewChild('modal', { static: false }) // Add { static: false } to avoid "ExpressionChangedAfterItHasBeenCheckedError"
  modal!: ElementRef<HTMLDialogElement>;

  openModal(): void {

    if (this.modal && this.modal.nativeElement) {
      this.modal.nativeElement.showModal();
    }

  }

  sendObjectToParent(customer: Customer) {
    this.objectSentToParent.emit(customer);
  }

  onCustomerCreate() {
    if (this.validation()) {
      if (this.postCustomer())
        this.sendObjectToParent(this.customer);
      this.modal.nativeElement.close();
    }
  }

  validation(): boolean {
    if (this.customer) {
        if (!!this.customer.name && !!this.customer.document && !!this.customer.phone1) {
            return true;
        } else {
            let fields: string[] = [];

            if (!!!this.customer['name']) fields.push("nome");
            if (!!!this.customer['document']) fields.push("RG/CPF");
            if (!!!this.customer['phone1']) fields.push("Telefone 1");

            let message = "Os campos " + fields.join(', ') + " não podem estar vazios!";
            console.log(message);
            //Toasty
        }
    }
    return false;
}

  postCustomer(): boolean {
    //service.PostCustomer;
    return true;
  }

}
