import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserProfile } from '../user-profile/user-profile.modal';
import Swal from 'sweetalert2'
import { userDetailService } from './userDetail.service';
// import * as _swal from 'sweetalert';
// import { SweetAlert } from 'sweetalert/typings/core';
// const swal: SweetAlert = _swal as any;

const isAuthorized = "isUserAuthorized";
const isLoggedIn = "isUserLoggedIn";

@Injectable()
export class AuthService implements OnInit {
  private user: Observable<firebase.User>;
  private userDetails = new BehaviorSubject<any>(null);
  private authState: any = null;
  isUserLoggedIn = new BehaviorSubject<Boolean>(false);
  isUserAuthorized = new BehaviorSubject<boolean>(false);
  userList: Observable<any>;
  allUsers: Array<any>;
  userID: any;
  admin = new BehaviorSubject<Boolean>(false);

  constructor(private _firebaseAuth: AngularFireAuth, private database: AngularFireDatabase, private router: Router,
    private userDetail: userDetailService) {
    this._firebaseAuth.authState.subscribe(response => {
      this.authState = response;
    });
  }

  ngOnInit() {
    this.user = this.authState;
    this.isUserLoggedIn.subscribe(res => {
      this.isLoggedIn();
    })
  }

  signInWithGoogle() {
    this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    ).then(response => {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['/library']);
    }).catch(error => {
      this.isUserLoggedIn.next(false);
      Swal({
        title: "Error",
        text: "No Google account found for these credentials",
        type: 'warning'
      });
      this.router.navigate(['/login'])
    });
    this.CurrentUserAuth();
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  isLoggedIn() {
    this.isUserLoggedIn.subscribe(res => {
      if (res === true) {
        return true;
      }
      else {
        return false;
      }
    });
  }

  isLoggedInNormal(User): Observable<any> {
    if (User.subscribe) {
      User.subscribe(
        (user) => {
          this.userID = user.uid;
          if (user) {
            this.isUserLoggedIn.next(true);
          } else {
            this.isUserLoggedIn.next(false);
          }
        }
      );
    } else {
      this.userID = User.id;
      if ((User.username !== null || User.username !== '') && (User.password !== null || User.password !== '')) {
        this.isUserLoggedIn.next(true);
      } else {
        this.isUserLoggedIn.next(false);
      }
    }
    return this.isUserLoggedIn;
  }

  // isLoggedInAuth(user) {
  //   console.log('value of  user in auth login fun', user);
  //   if (user !== null) {
  //     this.isUserLoggedIn.next(true);
  //   }
  // }

  login(username, password) {
    this.database.list('/Users', ref => ref.orderByChild('username').equalTo(username))
      .valueChanges().subscribe(res => {
        if (res.length !== 0) {
          this.allUsers = res;
          this.allUsers.map(data => {
          
            if (data.username.toLowerCase() === 'gursimran' && data.password.toLowerCase() === 'anmol_4501') {
              this.admin.next(true);
            }
            else {
              this.admin.next(false);
            }

            if (data.password === password) {
              this.isUserLoggedIn.next(true);
              this.isLoggedInNormal(data);
              this.router.navigate(['/library']);
              return;
            } else {
              Swal({
                title: "Password error",
                text: "Password is incorrect!",
                type: 'warning'
              });
              return false;
            }
          });
        } else {
          Swal({
            title: "User did not found",
            text: "No user found with this username"
          });
        }
      });
  }

  logout() {
    this.isUserLoggedIn.next(false);
    this.admin.next(false);
    this.userDetail.addToLocalStorage(isAuthorized, this.isUserAuthorized.value.toString())
    this.userDetail.addToLocalStorage(isLoggedIn, this.isUserLoggedIn.value.toString())
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  getAuthenticated(): boolean {
    return this.authState !== null;
  }
  getCurrentUser(): any {
    return this.getAuthenticated() ? this.authState : null;
  }
  getCurrentUserId(): any {
    return this.getAuthenticated() ? this.authState.uid : null;
  }
  getPhotoUrl(): any {
    return this.getAuthenticated() ? this.authState.photoURL : null;
  }
  getName(): any {
    return this.getAuthenticated() ? this.authState.displayName : null;
  }
  getEmail(): any {
    return this.getAuthenticated() ? this.authState.email : null;
  }
  getCurrentUserObservable(): Observable<any> {
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails.next(user);
        } else {
          this.userDetails.next(null);
        }
      }
    );
    return this.userDetails;
  }

  CurrentUser(username?: string, password?: string, email?: string, id?: string) {
    const profilePic = 'nothing';
    if (email !== undefined && password !== undefined && username !== undefined) {
      const user = new UserProfile(id, username, password, email, profilePic);
      this.database.database.ref('/Users').child(id).set(user).
        then(success =>
          this.router.navigate(['/login']).
            catch(error =>
              console.log('failed to enter current user in database' + error))
        );
    }
  }

  CurrentUserAuth() {
    const user = new UserProfile(this.getCurrentUserId(), this.getName(), null, this.getEmail(), this.getPhotoUrl());
    this.database.database.ref('/Users').child(this.getCurrentUserId()).set(user);
  }

  CurrentUserDetails() {
    return this.database.list<UserProfile>('/Users', ref => ref.orderByChild('id').equalTo(this.userID).limitToFirst(1)).valueChanges();
  }

}

