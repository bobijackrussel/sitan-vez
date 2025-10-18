import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictOrderStatusesComponent } from './dict-order-statuses.component';

describe('DictOrderStatusesComponent', () => {
  let component: DictOrderStatusesComponent;
  let fixture: ComponentFixture<DictOrderStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictOrderStatusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictOrderStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
