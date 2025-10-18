import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictCategoryMappingComponent } from './dict-category-mapping.component';

describe('DictCategoryMappingComponent', () => {
  let component: DictCategoryMappingComponent;
  let fixture: ComponentFixture<DictCategoryMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictCategoryMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictCategoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
