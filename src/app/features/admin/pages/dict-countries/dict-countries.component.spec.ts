import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictCountriesComponent } from './dict-countries.component';

describe('DictCountriesComponent', () => {
  let component: DictCountriesComponent;
  let fixture: ComponentFixture<DictCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictCountriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
