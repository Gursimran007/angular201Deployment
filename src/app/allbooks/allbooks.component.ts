import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, ViewChildren } from '@angular/core';
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
import swal from 'sweetalert'
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-allbooks',
  templateUrl: './allbooks.component.html',
  styleUrls: ['./allbooks.component.css']
})
export class AllbooksComponent implements OnInit {
  // @Input() color  = '#4DB6AC';
  panelOpenState: Boolean = true;
  categories = [];
  options: FormGroup;
  booksObservable: Observable<any>;
  searchValue: string;
  searchObservable: Observable<any>;
  category: string;
  filterCategories = [];
  emptyCategory: boolean = false;
  isAdmin: boolean = false;
  @ViewChildren('check') categoryIdentifier;
  constructor(private book: BooksService, fb: FormBuilder, private router: Router, public dialog: MatDialog , private auth: AuthService) {
    this.options = fb.group({
      'fixed': false,
      'top': 100,
      'bottom': 100,
    });
    this.booksObservable = this.book.books;
  }
  ngOnInit() {
    this.book.getAllBooks();
    this.getCategories();
    this.book.searchValue.subscribe(res => {
      this.searchByName(res);
    });
    this.auth.admin.subscribe(res => {
      this.isAdminOrUser(res);
    })
  }

isAdminOrUser(res){
  if(res === true){
    this.isAdmin = true;
    console.log('value of admin',this.isAdmin)
  }
  else {
    this.isAdmin = false;
  }
}

  searchByName(value) {
    if (value === '' || value === undefined || value === null) {
      this.booksObservable = this.book.books;
    } else {
      this.booksObservable = this.booksObservable.map(books => {
       return books.filter(book => {
          return book.title.toLowerCase().includes(value.toLowerCase());
        });
      });
    }
  }

  getCategories(): any {
    this.book.getAllBooks().subscribe(response => {
      response.map(res => {
        if(res.length === 0){
          this.emptyCategory = true;
        }
        if(this.categories.length !== 0){
          if(this.categories.includes(res.categories)){
          }
          else{
            this.categories.push(res.categories);
          }
        }
        else{
          this.categories.push(res.categories);
        }
      });
    });
  }

  filterBooks(event, category) {
    if (event.checked) {
      this.filterCategories.push(category);
      this.booksObservable = this.book.getAllBooks();
      this.booksObservable = this.booksObservable
        .map(books =>
          books.filter(book => {
            for (let i = 0; i < this.filterCategories.length; i++) {
              if (this.filterCategories[i].toLowerCase() === book.categories.toLowerCase()) {
                return true;
              }
            }
            return false;
          }));
    } else {
      this.filterCategories = this.filterCategories.filter(result => result !== category);
      this.booksObservable = this.book.getAllBooks();
      this.booksObservable = this.booksObservable
        .map(books =>
          books.filter(book => {
            for (let i = 0; i < this.filterCategories.length; i++) {
              if (this.filterCategories[i].toLowerCase() === book.categories.toLowerCase()) {
                return true;
              }
            }
            return false;
          }));
    }
    if (this.filterCategories.length === 0) {
      this.booksObservable = this.book.getAllBooks();
    }
  }

  clearFilter() {
    this.booksObservable = this.book.books;
    let unCheck;
    unCheck = this.categoryIdentifier;
    unCheck.map(res => {
      if (res.checked === true) {
        res.checked = false;
      }
    });
    // swal('hello world');
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
}
