import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, ViewChildren, AfterViewInit, AfterContentInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { BooksService } from '../services/books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AddbookComponent } from '../addbook/addbook.component';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs/';
@Component({
  selector: 'app-allbooks',
  templateUrl: './allbooks.component.html',
  styleUrls: ['./allbooks.component.css']
})
export class AllbooksComponent implements OnInit, AfterContentInit {

  panelOpenState: Boolean = true;
  categories = [];
  options: FormGroup;
  booksObservable: Observable<any>;
  searchValue: string;
  searchObservable: Observable<any>;
  category: string;
  filterCategories = [];
  emptyCategory: Boolean = false;
  isAdmin: Boolean = false;
  liked: Boolean = false;
  booksIssued = [];
  booksArray: Observable<any>;
  books: Observable<any>;
  subscription: Subscription;
  subscriptionBooks: Subscription;
  @ViewChildren('check') categoryIdentifier;
  constructor(private book: BooksService, fb: FormBuilder, private router: Router, public dialog: MatDialog, private auth: AuthService) { }
  ngOnInit() {
    this.book.getAllBooks().subscribe(books => {
      this.books = books;
      this.getBooks(this.booksIssued);
    });
    this.subscription = this.book.getIssuedBooksByUser().subscribe(booksIssued => {
      this.booksIssued = booksIssued;
      this.getBooks(booksIssued);
    });

    this.getCategories();
    this.book.searchValue.subscribe(res => {
      this.searchByName(res);
    });
    this.auth.admin.subscribe(res => {
      this.isAdminOrUser(res);
    });
  }

  ngAfterContentInit() {

  }

  checkSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.book.getIssuedBooksByUser().subscribe(booksIssued => {
      this.getBooks(booksIssued);
    });
  }
  getBooks(booksIssued) {
    if (booksIssued) {
      this.books.map(book => {
        booksIssued.map(issuedBook => {
          if (issuedBook.bookId === book.ISBN) {
            book.taken = true;
          }
        });
      });
    }
    this.booksArray = this.books;
    console.log('booksArray value', this.booksArray);
    this.booksObservable = this.booksArray;
  }

  filterLikedBooks(booksLiked) {
    this.book.getAllBooks().subscribe(books => {
      books.map(book => {
        booksLiked.map(LikedBook => {
          if (LikedBook.bookId === book.ISBN) {
            book.liked = true;
          }
        });
      });
      this.booksArray = books;
    });
    // this.subscription.unsubscribe();
  }

  isAdminOrUser(res) {
    if (res === true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  searchByName(value) {
    if (value === '' || value === undefined || value === null) {
      this.booksArray = this.booksObservable;
    } else {
      this.booksArray = this.booksArray.filter(book => {
        if (book.title.toLowerCase().includes(value.toLowerCase()) ||
          book.categories.toLowerCase().includes(value.toLowerCase()) ||
          book.authors.toLowerCase().includes(value.toLowerCase())) {
          return book;
        }
      });
    }
  }

  getCategories(): any {
    this.book.getAllBooks().subscribe(response => {
      response.map(res => {
        if (res.length === 0) {
          this.emptyCategory = true;
        }
        if (this.categories.length !== 0) {
          if (this.categories.includes(res.categories)) {
          } else {
            this.categories.push(res.categories);
          }
        } else {
          this.categories.push(res.categories);
        }
      });
    });
  }

  filterBooks(event, category) {
    if (event.checked) {
      this.filterCategories.push(category);
      this.booksArray = this.booksObservable;
      // this.booksArray = this.booksArray
      //   .map(books =>
      this.booksArray = this.booksArray.filter(book => {
        for (let i = 0; i < this.filterCategories.length; i++) {
          if (this.filterCategories[i].toLowerCase() === book.categories.toLowerCase()) {
            return true;
          }
        }
        return false;
      });
    } else {
      this.filterCategories = this.filterCategories.filter(result => result !== category);
      this.booksArray = this.booksObservable;
      this.booksArray = this.booksArray.filter(book => {
        for (let i = 0; i < this.filterCategories.length; i++) {
          if (this.filterCategories[i].toLowerCase() === book.categories.toLowerCase()) {
            return true;
          }
        }
        return false;
      });
    }
    if (this.filterCategories.length === 0) {
      this.booksArray = this.booksObservable;
    }
  }

  clearFilter() {
    this.booksArray = this.booksObservable;
    let unCheck;
    unCheck = this.categoryIdentifier;
    unCheck.map(res => {
      if (res.checked === true) {
        res.checked = false;
      }
    });
  }

  openDialog(book) {
    const dialogRef = this.dialog.open(BookDetailsComponent, {
      width: '750px',
      height: '420px',
      data: {
        bookDetails: book,
      }
    });
  }

  openBookDialog() {
    const dialogRef = this.dialog.open(AddbookComponent, {
      width: '750px',
      height: '420px',
      data: {

      }
    });
  }

  likeBook(bookId) {
    this.book.likeBook(bookId);
  }

  unLikeBook(bookId) {
    this.book.unLikeBook(bookId);
  }


  issueBook(bookId: number) {
    this.book.issueBook(bookId);
    this.booksArray.map(book => {
      console.log(book.ISBN , bookId);
      if (book.ISBN === bookId) {
        book['taken'] = true;
      }
    });
    // this.book.addIssuedBookArray();
  }


  returnBook(bookId: number) {
    this.book.returnBook(bookId);
    this.booksArray.map(book => {
      if (book.ISBN === bookId) {
        book['taken'] = false;
      }
    });
  }

}
