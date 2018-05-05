import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  users;
  profilePic;
  defaultProfilePic = '../../assets/images/defaultMenAvatar.png';
  // isAuthPicAvailable  = new BehaviorSubject<Boolean>(false);
  isAuthPicAvailable: Boolean = false;
  constructor( private auth: AuthService) { }

  ngOnInit() {
    this.auth.CurrentUserDetails().subscribe(res => {
      this.userDetails(res);
    });
  }

  userDetails(User) {
    this.users = User;
    this.users.map(res => {
      this.profilePic = res.profilePic;
      this.isAuthPicAvailable = true;
    });
  }
}
