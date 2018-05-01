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
import { AuthService } from './auth.service';
import { IssuedBookDetails } from './issuedBookDetails.modal';
@Injectable()
export class BooksService {

  searchValue = new BehaviorSubject<string>('');
  books: Observable<any>;
  booksArray : Book[] = [];
  book: Book;
  newBook: Book = null;
  newId: string;
  isIssued = new BehaviorSubject<boolean>(false);
  constructor(private db: AngularFireDatabase, private http: Http, private router: Router , private auth: AuthService) { }

  getAllBooks() {
    this.books = this.db.list<Book>('/getBooks').valueChanges();
    this.db.list<Book>('/getBooks').valueChanges().subscribe(response  => {
      this.booksArray = response;
    });
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
          responseJson.items[i].volumeInfo.categories[0], 1, responseJson.items[i].volumeInfo.description, responseJson.items[i].id,
          responseJson['items'][i].volumeInfo.imageLinks.thumbnail, 2, responseJson['items'][i].volumeInfo.title);
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

  issueBook(bookid: number) {
    let booksearched: Book;
    let issueNumber: number;
    let copiesCount: number;
    this.booksArray.filter(book => {
      if (book.id === bookid) {
        booksearched = book;
        issueNumber = book.issued;
        copiesCount = book.copies;
      }
    })
    this.db.object<Book>("/getBooks/" + bookid).update({
      issued: issueNumber + 1,
      copies: copiesCount - 1
    })

    let issueBook = {
      'userId': this.auth.userID, 'bookId': booksearched.id.toString(),
      'bookName': booksearched.title.toString(), 'userName': this.auth.getName()
    }
    var ref = this.db.database.ref("/IssuedBooks").push(issueBook);
    ref.update({
      id: ref.key,
      issuedDate: this.getTodaysDate()
    })
    // console.log(this.issued);
  }

  checkBookIssued(bookId: number) {
    let books = this.db.list<IssuedBookDetails>("/IssuedBooks/", ref => ref.orderByChild('userId').equalTo(this.auth.getCurrentUserId())).valueChanges();
    books.subscribe(books => {
      for (let book of books) {
        if (book.bookId == bookId) {
          this.isIssued.next(true);
        }
      }
    });
    if(this.isIssued.toString() === 'true'){
      return true;
    }
    else {
      return false;
    }
  }

  getIssuedBooksDetails() {
    let books = this.db.list<IssuedBookDetails>("/IssuedBooks/", ref => ref.orderByChild('userId')).valueChanges();
    return books;
  }
  deleteIssuedBookDetails(recordId) {
    this.db.object<IssuedBookDetails>("/IssuedBooks/" + recordId).remove();
  }
  getLikes(bookId) {
    return this.db.object<Book>("/Books/" + bookId).valueChanges();
  }

  returnBook(bookId: number) {
    let booksearched: Book;
    let issueNumber: number;
    let copiesCount: number;

    this.booksArray.filter(book => {
      if (book.id === bookId) {
        booksearched = book;
        issueNumber = book.issued;
        copiesCount = book.copies;
      }
    })
    this.db.object<Book>("/Books/" + bookId).update({
      issued: issueNumber - 1,
      copies: copiesCount + 1
    })

    let issuedBooksDetails = this.db.list<IssuedBookDetails>("/IssuedBooks", ref => ref.orderByChild('bookId')).valueChanges();
    issuedBooksDetails.subscribe(
      bookDetails => {
        for (let book of bookDetails) {
          if (book.bookId == bookId && book.userId === this.auth.getCurrentUserId()) {
            console.log(book);
            console.log(this.auth.getCurrentUserId());
            this.db.object<IssuedBookDetails>('/IssuedBooks/' + book.id).remove();
          }
        }
      }
    )
  }

  getTodaysDate() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    return (day + "/" + month + "/" + year);
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
