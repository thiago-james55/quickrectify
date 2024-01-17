import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [],
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css','../../../global.css']
})
export class PageTitleComponent {
  @Input() title: string = "";
}
