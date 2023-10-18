import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMessagesComponent } from './dialog-messages.component';

describe('DialogMessagesComponent', () => {
  let component: DialogMessagesComponent;
  let fixture: ComponentFixture<DialogMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogMessagesComponent]
    });
    fixture = TestBed.createComponent(DialogMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
