import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDropdownComponent } from './login-dropdown.component';

describe('LoginDropdownComponent', () => {
  let component: LoginDropdownComponent;
  let fixture: ComponentFixture<LoginDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDropdownComponent]
    });
    fixture = TestBed.createComponent(LoginDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
