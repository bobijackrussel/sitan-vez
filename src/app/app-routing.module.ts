import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },

  { path: 'public', loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule) },

  {
    path: 'client',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT'] },
    loadChildren: () => import('./features/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'tailor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TAILOR'] },
    loadChildren: () => import('./features/tailor/tailor.module').then(m => m.TailorModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },

  { path: '**', redirectTo: 'public' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
