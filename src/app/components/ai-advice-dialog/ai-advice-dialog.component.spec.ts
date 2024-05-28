import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAdviceDialogComponent } from './ai-advice-dialog.component';

describe('AiAdviceDialogComponent', () => {
  let component: AiAdviceDialogComponent;
  let fixture: ComponentFixture<AiAdviceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiAdviceDialogComponent]
    });
    fixture = TestBed.createComponent(AiAdviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
