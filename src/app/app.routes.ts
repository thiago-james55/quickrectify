import { Routes } from '@angular/router';
import { NewOrderComponent } from './pages/new-order/new-order.component';
import { HomeComponent } from './pages/home/home.component';
import { NoteComponent } from './pages/note/note.component';
import { ListOrdersComponent } from './pages/list-orders/list-orders.component';
import { ConsumersComponent } from './pages/consumers/consumers.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch:'full' },
    { path: 'new-order', component: NewOrderComponent },
    { path: 'list-orders', component: ListOrdersComponent },
    { path: 'consumers', component: ConsumersComponent },
    { path: 'note', component: NoteComponent },
    { path: 'about', component: AboutComponent },
    { path: '**', redirectTo: '' }
  ];
