import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AreaNavLink } from '../../../shared/ui/area-shell/area-shell.component';

@Component({
  selector: 'app-client-shell',
  standalone: false,
  template: `
    <app-area-shell
      [title]="'Client workspace'"
      [subtitle]="'Plan new orders, follow progress, and keep measurements up to date.'"
      [links]="links"
    >
      <ng-container shell-actions>
        <a routerLink="/client/order/new">New order</a>
        <a routerLink="/client/creations">Creations</a>
      </ng-container>
    </app-area-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientShellComponent {
  readonly links: AreaNavLink[] = [
    { label: 'Overview', route: '/client', exact: true },
    { label: 'Measurements', route: '/client/measurements', description: 'Capture and manage your measurements.' },
    { label: 'Orders', route: '/client/orders', description: 'Track every tailor collaboration in one place.' },
    { label: 'Creations', route: '/client/creations', description: 'Celebrate finished garments and share inspiration.' }
  ];
}
