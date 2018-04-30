import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  users;
  profilePic;
  defaultProfilePic = "../../assets/images/defaultMenAvatar.png"
  isAuthPicAvailable  = new BehaviorSubject<Boolean>(false);
  constructor( private auth: AuthService) { }

  ngOnInit() {
    this.auth.CurrentUserDetails().subscribe(res => {
      this.userDetails(res);
    });
  }

  userDetails(User){
    this.users = User;
    this.users.map(res => {
      console.log('response coming ' , res);
      this.profilePic = res.profilePic;
      this.isAuthPicAvailable.next(true);
    })
  }
}
