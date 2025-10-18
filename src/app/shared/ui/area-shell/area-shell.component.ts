import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth/auth.service';

export interface AreaNavLink {
  label: string;
  route: string;
  description?: string;
  exact?: boolean;
}

@Component({
  selector: 'app-area-shell',
  standalone: false,
  templateUrl: './area-shell.component.html',
  styleUrls: ['./area-shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaShellComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() links: AreaNavLink[] = [];

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  get authState$() {
    return this.auth.authState$;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/public']);
  }

  trackLink(_: number, link: AreaNavLink): string {
    return link.route;
  }

  roleLabel(role: UserRole | null): string {
    switch (role) {
      case 'CLIENT':
        return 'Client';
      case 'TAILOR':
        return 'Tailor';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Guest';
    }
  }
}
