import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAdvicesComponent } from './ai-advices.component';

describe('AiAdvicesComponent', () => {
  let component: AiAdvicesComponent;
  let fixture: ComponentFixture<AiAdvicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiAdvicesComponent]
    });
    fixture = TestBed.createComponent(AiAdvicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
