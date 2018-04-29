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
  passwordMatch: Boolean = true;
  constructor(public authService: AuthService, private router: Router, private authDatabase: AngularFireDatabase) { }
  ngOnInit() {
    this.signUpForm = new FormGroup({
      'username': new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'rePassword': new FormControl(null)
    });
  }

  onSubmit() {
    if (this.signUpForm.get('password').value !== this.signUpForm.get('rePassword').value) {
      this.passwordMatch = false;
    }
    const user = new UserProfile(null, this.signUpForm.get('username').value,
      this.signUpForm.get('password').value, this.signUpForm.get('email').value, null);
    // this.users.push(user);
    const ref = this.authDatabase.list('/Users').push(user);
    this.signInWithEmail(this.signUpForm.get('username').value, this.signUpForm.get('password').value);
    if (ref) {
      ref.update({
        id: ref.key
      });
      this.authService.CurrentUser(this.signUpForm.get('username').value,
        this.signUpForm.get('password').value, this.signUpForm.get('email').value, ref.key);
    }
  }
  signInWithEmail(username, password) {
    this.authService.signInRegular(username, password)
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
