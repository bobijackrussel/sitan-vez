import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TailorRoutingModule } from './tailor-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TailorShellComponent } from './layout/tailor-shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CatalogArticlesComponent } from './pages/catalog-articles/catalog-articles.component';
import { CatalogServicesComponent } from './pages/catalog-services/catalog-services.component';
import { CatalogArticleServicesComponent } from './pages/catalog-article-services/catalog-article-services.component';
import { CatalogAddonsComponent } from './pages/catalog-addons/catalog-addons.component';
import { OffersComponent } from './pages/offers/offers.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { AssetsComponent } from './pages/assets/assets.component';

@NgModule({
  declarations: [
    TailorShellComponent,
    DashboardComponent,
    ProfileComponent,
    CatalogArticlesComponent,
    CatalogServicesComponent,
    CatalogArticleServicesComponent,
    CatalogAddonsComponent,
    OffersComponent,
    OrdersComponent,
    OrderDetailComponent,
    AssetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    TailorRoutingModule
  ]
})
export class TailorModule {}
