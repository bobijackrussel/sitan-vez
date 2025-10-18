import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './layout/admin-shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { DictCountriesComponent } from './pages/dict-countries/dict-countries.component';
import { DictColorsComponent } from './pages/dict-colors/dict-colors.component';
import { DictMaterialsComponent } from './pages/dict-materials/dict-materials.component';
import { DictQualitiesComponent } from './pages/dict-qualities/dict-qualities.component';
import { DictCategoriesComponent } from './pages/dict-categories/dict-categories.component';
import { DictSubcategoriesComponent } from './pages/dict-subcategories/dict-subcategories.component';
import { DictCategoryMappingComponent } from './pages/dict-category-mapping/dict-category-mapping.component';
import { DictOrderStatusesComponent } from './pages/dict-order-statuses/dict-order-statuses.component';
import { DictItemStatusesComponent } from './pages/dict-item-statuses/dict-item-statuses.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'dictionaries/countries', component: DictCountriesComponent },
      { path: 'dictionaries/colors', component: DictColorsComponent },
      { path: 'dictionaries/materials', component: DictMaterialsComponent },
      { path: 'dictionaries/qualities', component: DictQualitiesComponent },
      { path: 'dictionaries/categories', component: DictCategoriesComponent },
      { path: 'dictionaries/subcategories', component: DictSubcategoriesComponent },
      { path: 'dictionaries/category-mapping', component: DictCategoryMappingComponent },
      { path: 'dictionaries/order-statuses', component: DictOrderStatusesComponent },
      { path: 'dictionaries/item-statuses', component: DictItemStatusesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
