import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('from should be invalid' , async(() => {
    component.signUpForm.controls['username'].setValue('');
    component.signUpForm.controls['email'].setValue('');
    component.signUpForm.controls['password'].setValue('');
    component.signUpForm.controls['rePassword'].setValue('');
    expect(component.signUpForm.valid).toBeFalsy();
  })
);

it('from should be valid' , async(() => {
  component.signUpForm.controls['username'].setValue('something');
    component.signUpForm.controls['email'].setValue('something@example.com');
    component.signUpForm.controls['password'].setValue('anmol');
    component.signUpForm.controls['rePassword'].setValue('anmol');
    expect(component.signUpForm.valid).toBeTruthy();
})
);

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
