import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientShellComponent } from './layout/client-shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MeasurementsComponent } from './pages/measurements/measurements.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderItemNewComponent } from './pages/order-item-new/order-item-new.component';
import { OrderReviewComponent } from './pages/order-review/order-review.component';
import { OrdersListComponent } from './pages/orders-list/orders-list.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { CreationsComponent } from './pages/creations/creations.component';

const routes: Routes = [
  {
    path: '',
    component: ClientShellComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'measurements', component: MeasurementsComponent },
      { path: 'order/new', component: OrderNewComponent },
      { path: 'order/:orderId/items/new', component: OrderItemNewComponent },
      { path: 'order/:orderId/review', component: OrderReviewComponent },
      { path: 'orders', component: OrdersListComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'creations', component: CreationsComponent }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ClientRoutingModule {}
