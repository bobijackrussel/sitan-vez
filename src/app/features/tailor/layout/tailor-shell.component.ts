import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AreaNavLink } from '../../../shared/ui/area-shell/area-shell.component';

@Component({
  selector: 'app-tailor-shell',
  standalone: false,
  template: `
    <app-area-shell
      [title]="'Tailor workspace'"
      [subtitle]="'Oversee your atelier, catalogue, and incoming commissions.'"
      [links]="links"
    >
      <ng-container shell-actions>
        <a routerLink="/tailor/offers">Offers</a>
        <a routerLink="/tailor/orders">Orders</a>
      </ng-container>
    </app-area-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailorShellComponent {
  readonly links: AreaNavLink[] = [
    { label: 'Overview', route: '/tailor', exact: true },
    { label: 'Profile', route: '/tailor/profile', description: 'Update studio details and working terms.' },
    { label: 'Articles', route: '/tailor/catalog/articles', description: 'Maintain article catalogue with fabrics and sizing.' },
    { label: 'Services', route: '/tailor/catalog/services', description: 'Describe services clients can book.' },
    { label: 'Article services', route: '/tailor/catalog/article-services', description: 'Bundle articles with specialized services.' },
    { label: 'Add-ons', route: '/tailor/catalog/addons', description: 'Manage embellishments and add-on work.' },
    { label: 'Offers', route: '/tailor/offers', description: 'Publish curated offers for clients.' },
    { label: 'Orders', route: '/tailor/orders', description: 'Track every commission and delivery date.' },
    { label: 'Assets', route: '/tailor/assets', description: 'Upload patterns, measurement guides, and media.' }
  ];
}
