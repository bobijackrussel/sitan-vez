import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MeasurementsComponent } from './pages/measurements/measurements.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderItemNewComponent } from './pages/order-item-new/order-item-new.component';
import { OrderReviewComponent } from './pages/order-review/order-review.component';
import { OrdersListComponent } from './pages/orders-list/orders-list.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { CreationsComponent } from './pages/creations/creations.component';
import { ClientShellComponent } from './layout/client-shell.component';

@NgModule({
  declarations: [
    ClientShellComponent,
    DashboardComponent,
    MeasurementsComponent,
    OrderNewComponent,
    OrderItemNewComponent,
    OrderReviewComponent,
    OrdersListComponent,
    OrderDetailComponent,
    CreationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule {}
