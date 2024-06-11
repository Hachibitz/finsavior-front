import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnalysisListComponent } from './ai-analysis-list.component';

describe('AiAnalysisListComponent', () => {
  let component: AiAnalysisListComponent;
  let fixture: ComponentFixture<AiAnalysisListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiAnalysisListComponent]
    });
    fixture = TestBed.createComponent(AiAnalysisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
