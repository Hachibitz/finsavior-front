import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndPrivacyDialogComponent } from './terms-and-privacy-dialog.component';

describe('TermsAndPrivacyDialogComponent', () => {
  let component: TermsAndPrivacyDialogComponent;
  let fixture: ComponentFixture<TermsAndPrivacyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndPrivacyDialogComponent]
    });
    fixture = TestBed.createComponent(TermsAndPrivacyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
