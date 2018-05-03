import { Component, OnInit, Inject, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../services/books.service';
import { Book } from '../book-details/book.modal';
import { Observable } from 'rxjs/observable';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit, AfterViewInit {
  booksObservable: Observable<Book>;
  book: Book = null;
  @ViewChildren('title') bookTitle;
  @ViewChildren('author') bookAuthor;
  @ViewChildren('category') bookCategory;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRefClose: MatDialogRef<AddbookComponent>,
    private db: AngularFireDatabase, private route: ActivatedRoute,
    private bookService: BooksService) { }
  ngOnInit() {

  }

  ngAfterViewInit() {

  }
  searchByIsbn(isbn) {
    this.booksObservable = this.bookService.serachBookByISBN(isbn);
    this.booksObservable.subscribe(response => {
      this.book = response;
    });
  }

  addBookByISBN(book) {
    const check = this.bookService.checkIfBookAlreadyPresent(book);
    if (check === true) {
      this.bookService.addBook(book);
    } else {
      Swal({
        title: 'Book already present!',
        text: 'Do `you stil want to add?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.bookService.addBook(book);
        }
      });
    }
    this.dialogRefClose.close();
  }
}
