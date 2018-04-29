import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Book } from '../book-details/book.modal';
import { HttpModule, Http } from '@angular/http';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BookDetailsComponent } from '../book-details/book-details.component';
@Injectable()
export class BooksService {

  searchValue = new BehaviorSubject<string>('');
  books: Observable<any>;
  book: Book;
  newBook: Book = null;
  newId: string;
  constructor(private db: AngularFireDatabase, private http: Http , private router: Router) { }

  getAllBooks() {
    this.books = this.db.list('/getBooks').valueChanges();
    return this.books;
  }

  searchBook(value) {
    this.searchValue.next(value);
  }

  getListOfBooksByIsbn(isbn) {
    this.http.get('https://www.googleapis.com/books/v1/volumes/?q=isbn:' + isbn).subscribe((response) => {
      const responseJson = response.json();
      console.log(responseJson);
      for (let i = 0; i < responseJson['items'].length; i++) {
          this.newBook = new Book(isbn,
          responseJson.items[i].volumeInfo.authors[0],
          responseJson.items[i].volumeInfo.categories[0], 1, responseJson.items[i].volumeInfo.description, responseJson.items[i].id ,
            responseJson['items'][i].volumeInfo.imageLinks.thumbnail , 2 , responseJson['items'][i].volumeInfo.title);
      }
    });
    console.log(isbn.toString());
    this.newId = isbn.toString();
    // this.db.object<Book>('/getBooks').set(this.newBook);
    this.db.database.ref('/getBooks').child(this.newId).set(this.newBook).
      then(success => {
        console.log('book is getting added');
      });
  }

  deleteBook(bookId: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Book!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.db.object<Book>('/getBooks/' + bookId).remove();
        Swal(
          'Deleted!',
          'The book has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your book is safe :)',
          'error'
        )
      }
    })
  }

  updateBookRecords(id: number, name: string, authorName: string, category: string) {
    this.db.object<Book>('/getBooks/' + id).update({
      title: name,
      authors: authorName,
      categories: category
    })
  }
}

/*// for (let i = 0; i < responseJson['items'].length; i++) {
      //   console.log(responseJson['items'][i].volumeInfo.title);
      //   console.log(responseJson['items'][i].volumeInfo.authors);
      //   console.log(responseJson['items'][i].volumeInfo.imageLinks.thumbnail);
      //   books = new book(null, responseJson['items'][i].volumeInfo.title, responseJson['items'][i].volumeInfo.authors[0], 0,
      //     responseJson['items'][i].volumeInfo.imageLinks.thumbnail, 10, responseJson['items'][i].volumeInfo.category,
      //     responseJson['items'][i].volumeInfo.rating);
      //   this.book.next(books);
      // }  */