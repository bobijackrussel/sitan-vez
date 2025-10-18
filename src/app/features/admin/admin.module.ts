import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
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

@NgModule({
  declarations: [
    AdminShellComponent,
    DashboardComponent,
    ClientsComponent,
    DictCountriesComponent,
    DictColorsComponent,
    DictMaterialsComponent,
    DictQualitiesComponent,
    DictCategoriesComponent,
    DictSubcategoriesComponent,
    DictCategoryMappingComponent,
    DictOrderStatusesComponent,
    DictItemStatusesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
