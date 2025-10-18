import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictSubcategoriesComponent } from './dict-subcategories.component';

describe('DictSubcategoriesComponent', () => {
  let component: DictSubcategoriesComponent;
  let fixture: ComponentFixture<DictSubcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictSubcategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
