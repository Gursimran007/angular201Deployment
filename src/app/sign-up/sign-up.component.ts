import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserProfile } from '../user-profile/user-profile.modal';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  users: Array<UserProfile>;
  signUpForm: FormGroup;
  validUsername: Boolean = true;
  validEmail: Boolean = true;
  validPassword: Boolean = true;
  validRePassword: Boolean = true;
  validMatch: Boolean = true;
  constructor(public authService: AuthService, private router: Router, private authDatabase: AngularFireDatabase) { }
  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      rePassword: new FormControl()
    });
  }

  onSubmit() {
    if (!this.signUpForm.get('username').valid && this.signUpForm.get('username').touched) {
      this.validUsername = false;
    }
    if (!this.signUpForm.get('email').valid && this.signUpForm.get('email').touched) {
      this.validEmail = false;
    }
    if (!this.signUpForm.get('password').valid && this.signUpForm.get('password').touched) {
      this.validPassword = false;
    }
    if (!this.signUpForm.get('rePassword').valid && this.signUpForm.get('rePassword').touched) {
      this.validUsername = false;
    }
    if (this.signUpForm.get('password').value !== this.signUpForm.get('rePassword').value) {
      this.validUsername = false;
    }
    if (this.validUsername && this.validPassword && this.validEmail && this.validRePassword && this.validMatch) {
      const user = new UserProfile(null, this.signUpForm.get('username').value,
        this.signUpForm.get('password').value, this.signUpForm.get('email').value, null);
      // this.users.push(user);
      this.signInWithEmail(this.signUpForm.get('email').value, this.signUpForm.get('password').value);
      const ref = this.authDatabase.list('/Users').push(user);

      if (ref) {
        ref.update({
          id: ref.key
        });
        this.authService.CurrentUser(this.signUpForm.get('username').value,
          this.signUpForm.get('password').value, this.signUpForm.get('email').value, ref.key);
      }
    }
  }
  signInWithEmail(email, password) {
    this.authService.signInRegular(email, password)
      .then((res) => {
        console.log(res);
        this.router.navigate(['login']);
      })
      .catch((err) => console.log('error: ' + err));
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
