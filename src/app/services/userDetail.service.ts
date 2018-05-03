import { Injectable } from '@angular/core';
import { UserProfile } from '../user-profile/user-profile.modal';

const USER_KEY = 'user';

@Injectable()
export class UserDetailService {

  constructor() { }

  addToLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  getStoredItem(key): any {
    return localStorage.getItem(key);
  }

  removeStoredItem(key) {
    localStorage.removeItem(key);
  }

  storeUserObject(userObject: {}) {
    this.addToLocalStorage(USER_KEY, JSON.stringify(userObject));
  }

  getUserObject(): UserProfile {
    const userString = this.getStoredItem(USER_KEY);
    if (userString == null || userString === 'undefined') {
      return null;
    }
    return new UserProfile(JSON.parse(this.getStoredItem(USER_KEY)));
  }

  removeStoredUser() {
    this.removeStoredItem(USER_KEY);
  }

  isUserLoggedIn(): boolean {
    if (this.getUserObject() == null) {
      return false;
    } else {
      return true;
    }
  }
}
