/*import { Injectable } from '@angular/core';
import { Users } from '../Users';

const USER_KEY="user";

@Injectable()
export class userDetailService {

  constructor() { }

  addToLocalStorage(key,value){
    localStorage.setItem(key,value);
  }

  getStoredItem(key):any{
    return localStorage.getItem(key);
  }

  removeStoredItem(key){
    localStorage.removeItem(key);
  }

  storeUserObject(userObject:{}){
    this.addToLocalStorage(USER_KEY,JSON.stringify(userObject));
  }

  getUserObject():Users{
    var userString=this.getStoredItem(USER_KEY);
    if(userString==null || userString=='undefined'){
      return null;
    }
     return new Users(JSON.parse(this.getStoredItem(USER_KEY)));
  }

  removeStoredUser(){
    this.removeStoredItem(USER_KEY);
  }

  isUserLoggedIn():boolean{
    if(this.getUserObject()==null){
      return false;
    }
    else{
      return true;
    }
  }
} */