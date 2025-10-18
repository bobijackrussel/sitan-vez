import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogServicesComponent } from './catalog-services.component';

describe('CatalogServicesComponent', () => {
  let component: CatalogServicesComponent;
  let fixture: ComponentFixture<CatalogServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
