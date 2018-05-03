import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SlicePipe } from '@angular/common';
import 'rxjs/add/operator/toPromise';
import { BooksService } from '../services/books.service';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { AllbooksComponent } from '../allbooks/allbooks.component';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  private id: string;
  book: any;
  avatar;
  isAdmin: Boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRefClose: MatDialogRef<BookDetailsComponent>,
   private db: AngularFireDatabase, private route: ActivatedRoute,
    public bk: BooksService, public dialog: MatDialog , private auth: AuthService) { }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.book = this.data.bookDetails;
    this.auth.admin.subscribe(res => {
      this.isAdminOrUser(res);
    });
  }

  isAdminOrUser(user) {
    if (user === true) {
      this.isAdmin = true;
    }else {
      this.isAdmin = false;
    }
  }

  getBookData(path) {
    this.db.object(path).valueChanges().withLatestFrom().subscribe(res => {
      this.book = res;
      console.log('value of the book object inside', this.book);
    });
    return this.book;
  }

  deleteBook(id) {
    console.log(id);
    this.bk.deleteBook(id);
    this.dialogRefClose.close();
  }

  openEditDialog() {
    this.dialogRefClose.close();
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: '500px',
      height: '420px',
      data: {
        bookDetails: this.book
      }
    });
  }

  issueBook(bookId: number) {
    this.book.checkBookIssued(bookId).subscribe(response => {
      if (response === false) {
        console.log('value of response', response);
        this.book.issueBook(bookId);
      }else {
        Swal({
          title: 'Cannot Re-issue this book',
          text: 'Book Already issued',
          type: 'warning'
        });
      }
    });
  }
}
