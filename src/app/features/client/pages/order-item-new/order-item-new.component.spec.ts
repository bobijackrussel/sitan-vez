import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemNewComponent } from './order-item-new.component';

describe('OrderItemNewComponent', () => {
  let component: OrderItemNewComponent;
  let fixture: ComponentFixture<OrderItemNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
