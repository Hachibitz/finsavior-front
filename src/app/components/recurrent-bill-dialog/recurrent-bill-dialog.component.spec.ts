import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentBillDialogComponent } from './recurrent-bill-dialog.component';

describe('RecurrentBillDialogComponent', () => {
  let component: RecurrentBillDialogComponent;
  let fixture: ComponentFixture<RecurrentBillDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecurrentBillDialogComponent]
    });
    fixture = TestBed.createComponent(RecurrentBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
