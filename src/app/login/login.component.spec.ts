import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
    });
  }));

  it('from should be invalid' , async(() => {
    component.LoginForm.controls['username'].setValue('');
    component.LoginForm.controls['password'].setValue('');

    expect(component.LoginForm.valid).toBeFalsy();
  })
);

it('from should be valid' , async(() => {
  component.LoginForm.controls['username'].setValue('gursimran');
  component.LoginForm.controls['password'].setValue('something');

  expect(component.LoginForm.valid).toBeTruthy();
})
);
// checks for email and password
it('should have one user' , async(() => {
  expect(component.user.email);
  expect(component.user.password);
}));
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
