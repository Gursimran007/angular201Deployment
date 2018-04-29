import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isUserLogged: Boolean;
  constructor(public authService: AuthService) {

  }

  ngOnInit() {
   this.authService.isUserLoggedIn.subscribe(res => {
     console.log('value of response coming lets see' , res);
     this.isUserLogged = res;
   });
  }
}
