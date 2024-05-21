import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowlistComponent } from './borrowlist.component';

describe('BorrowlistComponent', () => {
  let component: BorrowlistComponent;
  let fixture: ComponentFixture<BorrowlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorrowlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
