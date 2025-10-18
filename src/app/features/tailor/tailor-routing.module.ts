import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {
    path: '',
    component: TailorShellComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'catalog/articles', component: CatalogArticlesComponent },
      { path: 'catalog/services', component: CatalogServicesComponent },
      { path: 'catalog/article-services', component: CatalogArticleServicesComponent },
      { path: 'catalog/addons', component: CatalogAddonsComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'assets', component: AssetsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TailorRoutingModule {}
