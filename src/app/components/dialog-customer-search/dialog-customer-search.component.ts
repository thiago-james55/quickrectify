import { getCustomers } from '../../service/model/Customer.entity';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Customer } from '../../service/model/Customer.entity';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dialog-customer-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-customer-search.component.html',
  styleUrls: ['./dialog-customer-search.component.css', '../../../global.css']
})
export class DialogCustomerSearchComponent {

  customers: Customer[] = getCustomers();

  @Output() objectSentToParent: EventEmitter<any> = new EventEmitter();

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

  onCustomerChoose(customer: Customer) {
    this.sendObjectToParent(customer);
    this.modal.nativeElement.close();
  }


}
