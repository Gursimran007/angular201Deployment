import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any , private db: AngularFireDatabase  , private route: ActivatedRoute ,
   private bookService: BooksService) { }

  ngOnInit() {
  }
  searchByIsbn(isbn) {
    this.bookService.getListOfBooksByIsbn(isbn);
    // this.bookService.book.subscribe(book => this.books = book);
  }
}
