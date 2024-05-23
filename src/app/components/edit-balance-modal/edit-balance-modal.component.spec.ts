import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBalanceModalComponent } from './edit-balance-modal.component';

describe('EditBalanceModalComponent', () => {
  let component: EditBalanceModalComponent;
  let fixture: ComponentFixture<EditBalanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBalanceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBalanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
