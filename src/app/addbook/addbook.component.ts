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
    this.bookService.addBook(book);
    this.dialogRefClose.close();
  }

}
