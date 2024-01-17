import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-handler.component.html',
  styleUrls: ['./order-handler.component.css','../../../global.css']
})
export class OrderHandlerComponent {
  
  parts: string[] = ['Biela', 'Bloco', 'Cabeçote','Virabrequim','Volante']; 

}
