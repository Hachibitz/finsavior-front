import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnalysisDetailComponent } from './ai-analysis-detail.component';

describe('AiAnalysisDetailComponent', () => {
  let component: AiAnalysisDetailComponent;
  let fixture: ComponentFixture<AiAnalysisDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiAnalysisDetailComponent]
    });
    fixture = TestBed.createComponent(AiAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
