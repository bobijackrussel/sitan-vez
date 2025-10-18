import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-shell',
  standalone: false,
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicShellComponent {}
