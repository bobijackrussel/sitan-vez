import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictColorsComponent } from './dict-colors.component';

describe('DictColorsComponent', () => {
  let component: DictColorsComponent;
  let fixture: ComponentFixture<DictColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictColorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
