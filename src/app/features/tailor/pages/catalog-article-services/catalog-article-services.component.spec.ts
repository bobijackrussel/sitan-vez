import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogArticleServicesComponent } from './catalog-article-services.component';

describe('CatalogArticleServicesComponent', () => {
  let component: CatalogArticleServicesComponent;
  let fixture: ComponentFixture<CatalogArticleServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogArticleServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogArticleServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
