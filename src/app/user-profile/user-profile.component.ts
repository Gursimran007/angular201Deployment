import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BooksService } from '../services/books.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  users;
  profilePic;
  booksIssued = [];
  constructor(private auth: AuthService, private book: BooksService) { }

  ngOnInit() {
    this.auth.CurrentUserDetails().subscribe(res => {
      this.userDetails(res);
    });
    this.book.getIssuedBooksByUser().subscribe(books => {
      this.getIssuedBookDetails(books);
    });
  }

  userDetails(User) {
    this.users = User;
    this.users.map(res => {
      if (res.profilePic.toString() === 'nothing') {
        this.profilePic = '../../assets/images/defaultMenAvatar.png';
      } else {
        this.profilePic = res.profilePic;
      }
    });
  }

  getIssuedBookDetails(books) {
    this.booksIssued = books;
    this.booksIssued.filter(book => {
      if (book.userId === this.auth.userID) {
        return book;
      }
    });
  }

  returnBook(bookId) {
    this.book.returnBook(bookId);
  }
}
