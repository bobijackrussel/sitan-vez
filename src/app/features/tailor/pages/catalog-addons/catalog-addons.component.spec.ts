import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogAddonsComponent } from './catalog-addons.component';

describe('CatalogAddonsComponent', () => {
  let component: CatalogAddonsComponent;
  let fixture: ComponentFixture<CatalogAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogAddonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
