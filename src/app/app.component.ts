import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './core/auth/auth.service';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly primaryLinks: NavLink[] = [
    { label: 'Home', route: '/public' },
    { label: 'Browse Offers', route: '/public/offers' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  get authState$() {
    return this.auth.authState$;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/public']);
  }

  areaLink(role: UserRole | null): string {
    return this.auth.routeForRole(role);
  }

  trackLink(_: number, link: NavLink): string {
    return link.route;
  }

  roleLabel(role: UserRole | null): string {
    switch (role) {
      case 'CLIENT': return 'Client';
      case 'TAILOR': return 'Tailor';
      case 'ADMIN': return 'Admin';
      default: return 'Guest';
    }
  }
}
