import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictMaterialsComponent } from './dict-materials.component';

describe('DictMaterialsComponent', () => {
  let component: DictMaterialsComponent;
  let fixture: ComponentFixture<DictMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
