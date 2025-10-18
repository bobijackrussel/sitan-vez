import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictCategoriesComponent } from './dict-categories.component';

describe('DictCategoriesComponent', () => {
  let component: DictCategoriesComponent;
  let fixture: ComponentFixture<DictCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
