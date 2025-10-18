import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LandingComponent } from './pages/landing/landing.component';
import { OffersListComponent } from './pages/offers-list/offers-list.component';
import { OfferDetailComponent } from './pages/offer-detail/offer-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterClientComponent } from './pages/register-client/register-client.component';
import { RegisterTailorComponent } from './pages/register-tailor/register-tailor.component';
import { PublicShellComponent } from './layout/public-shell.component';

@NgModule({
  declarations: [
    PublicShellComponent,
    LandingComponent,
    OffersListComponent,
    OfferDetailComponent,
    LoginComponent,
    RegisterClientComponent,
    RegisterTailorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PublicRoutingModule,
    SharedModule,
  ]
})
export class PublicModule {}
