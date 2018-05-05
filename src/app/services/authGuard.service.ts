import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class AuthGuardService implements CanActivate {
  response: any;
    constructor(private router: Router, private authService: AuthService) { }
    canActivate() {
      this.authService.isUserLoggedIn.subscribe(res => {
        this.response = res;
      });
        if ( this.response.toString() === 'true') {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
