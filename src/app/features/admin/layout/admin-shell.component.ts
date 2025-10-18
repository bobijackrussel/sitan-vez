import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AreaNavLink } from '../../../shared/ui/area-shell/area-shell.component';

@Component({
  selector: 'app-admin-shell',
  standalone: false,
  template: `
    <app-area-shell
      [title]="'Admin console'"
      [subtitle]="'Oversee platform operations, dictionaries, and user records.'"
      [links]="links"
    >
      <ng-container shell-actions>
        <a routerLink="/admin/clients">Clients</a>
        <a routerLink="/admin/dictionaries/countries">Dictionaries</a>
      </ng-container>
    </app-area-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminShellComponent {
  readonly links: AreaNavLink[] = [
    { label: 'Overview', route: '/admin', exact: true },
    { label: 'Clients', route: '/admin/clients', description: 'Review registered clients and manage access.' },
    { label: 'Countries', route: '/admin/dictionaries/countries', description: 'Maintain supported shipping destinations.' },
    { label: 'Colors', route: '/admin/dictionaries/colors', description: 'Manage colour dictionary for articles.' },
    { label: 'Materials', route: '/admin/dictionaries/materials', description: 'Add or retire material options.' },
    { label: 'Qualities', route: '/admin/dictionaries/qualities', description: 'Control craftsmanship quality levels.' },
    { label: 'Categories', route: '/admin/dictionaries/categories', description: 'High-level categorisation for offers.' },
    { label: 'Subcategories', route: '/admin/dictionaries/subcategories', description: 'Organise detailed garment groupings.' },
    { label: 'Category mapping', route: '/admin/dictionaries/category-mapping', description: 'Connect categories with subcategories.' },
    { label: 'Order statuses', route: '/admin/dictionaries/order-statuses', description: 'Configure status lifecycle for orders.' },
    { label: 'Item statuses', route: '/admin/dictionaries/item-statuses', description: 'Manage status list for order items.' }
  ];
}
