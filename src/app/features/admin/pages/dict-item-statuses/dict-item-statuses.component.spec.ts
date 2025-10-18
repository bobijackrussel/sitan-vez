import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictItemStatusesComponent } from './dict-item-statuses.component';

describe('DictItemStatusesComponent', () => {
  let component: DictItemStatusesComponent;
  let fixture: ComponentFixture<DictItemStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictItemStatusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictItemStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
