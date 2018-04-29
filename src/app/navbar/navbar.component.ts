import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { BooksService } from '../services/books.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchElement: Boolean = false;
  constructor(private book: BooksService , public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  toggleSearchElement() {
    if (this.searchElement === true) {
      this.searchElement = false;
    } else if (this.searchElement === false) {
      this.searchElement = true;
    }
  }

  searchResult(searchValue , name) {
    this.book.searchBook(searchValue);
  }

  searchKeyword(serachValue) {
    this.book.searchBook(serachValue.value);
  }

  goToUserProfile() {
    console.log('contrl is coming on click of profile')
    this.router.navigate(['/userProfile']);
  }
}
