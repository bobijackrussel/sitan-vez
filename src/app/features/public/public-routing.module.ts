import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicShellComponent } from './layout/public-shell.component';
import { LandingComponent } from './pages/landing/landing.component';
import { OffersListComponent } from './pages/offers-list/offers-list.component';
import { OfferDetailComponent } from './pages/offer-detail/offer-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterClientComponent } from './pages/register-client/register-client.component';
import { RegisterTailorComponent } from './pages/register-tailor/register-tailor.component';

const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'offers', component: OffersListComponent },
      { path: 'offers/:id', component: OfferDetailComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register-client', component: RegisterClientComponent },
      { path: 'register-tailor', component: RegisterTailorComponent }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class PublicRoutingModule {}
