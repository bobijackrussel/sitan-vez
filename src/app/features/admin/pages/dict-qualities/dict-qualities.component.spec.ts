import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictQualitiesComponent } from './dict-qualities.component';

describe('DictQualitiesComponent', () => {
  let component: DictQualitiesComponent;
  let fixture: ComponentFixture<DictQualitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictQualitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictQualitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
