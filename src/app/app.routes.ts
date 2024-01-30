import { Routes } from '@angular/router';
import { NewOrderComponent } from './pages/new-order/new-order.component';
import { HomeComponent } from './pages/home/home.component';
import { NoteComponent } from './pages/note/note.component';

export const routes: Routes = [
    { path:'', component:HomeComponent}, 
    { path: 'neworder',component:NewOrderComponent},
    { path: 'note', component:NoteComponent },
];
