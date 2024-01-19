import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Part, getParts } from '../../service/model/Part.entity';

@Component({
  selector: 'app-order-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-handler.component.html',
  styleUrls: ['./order-handler.component.css','../../../global.css']
})
export class OrderHandlerComponent {
  

  //Service.getGroups
  parts: Part[] = getParts();

}

