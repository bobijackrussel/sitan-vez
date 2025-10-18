import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const allowed = (route.data['roles'] as UserRole[] | undefined) ?? [];
    const role = this.auth.role;

    if (!allowed.length) {
      return true;
    }

    if (role && allowed.includes(role)) {
      return true;
    }

    if (!role) {
      return this.router.createUrlTree(['/public/login'], { queryParams: { redirect: state.url } });
    }

    return this.router.parseUrl(this.auth.routeForRole(role));
  }
}
