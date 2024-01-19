import { Routes } from '@angular/router';
import { NewOrderComponent } from './pages/new-order/new-order.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path:'',
        component:NewOrderComponent
    }, {
        path: 'neworder',
        component:NewOrderComponent
    }
];
