import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  LoginSrc = '../../assets/images/login-.png';
  avatarSrc = '../../assets/images/login-avatar.png';
  LoginForm: FormGroup;
  validUsername: Boolean = true;
  validPassword: Boolean = true;
  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit() {
    this.LoginForm = new FormGroup({
      'username': new FormControl(null),
      'password': new FormControl(null)
    });
  }

  login() {
    const username = this.LoginForm.get('username').value;
    const password = this.LoginForm.get('password').value;
    if (!this.LoginForm.get('username').valid && this.LoginForm.get('username').touched) {
      this.validUsername = false;
    }
    if (!this.LoginForm.get('password').valid && this.LoginForm.get('password').touched) {
      this.validPassword = false;
    }
    if (this.validUsername && this.validPassword) {
      this.authService.login(username, password);
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  askingForSignUp() {
    this.router.navigate(['/signup']);
  }
}
