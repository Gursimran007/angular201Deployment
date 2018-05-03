import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Book } from '../book-details/book.modal';
import { HttpModule, Http } from '@angular/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { AuthService } from './auth.service';
import { IssuedBookDetails } from './issuedBookDetails.modal';
import { AddbookComponent } from '../addbook/addbook.component';
@Injectable()
export class BooksService {

  searchValue = new BehaviorSubject<string>('');
  books: Observable<any>;
  booksArray: Book[] = [];
  book: Book;
  newBook = new BehaviorSubject<Book>(null);
  newId: string;
  isIssued = new BehaviorSubject<boolean>(false);
  constructor(private db: AngularFireDatabase, private http: Http, private router: Router,
    private auth: AuthService) { }

  getAllBooks() {
    this.books = this.db.list<Book>('/getBooks').valueChanges();
    this.db.list<Book>('/getBooks').valueChanges().subscribe(response => {
      this.booksArray = response;
    });
    return this.books;
  }

  searchBook(value) {
    this.searchValue.next(value);
  }

  serachBookByISBN(isbn): Observable<Book> {
    this.http.get('https://www.googleapis.com/books/v1/volumes/?q=isbn:' + isbn).subscribe((response) => {
      let responseJson = response.json();
      // console.log('lets see when parsing the data in string how it comes' , JSON.parse( JSON.stringify(responseJson )));
      responseJson = JSON.parse(JSON.stringify(responseJson));
      // JSON.parse(replaceAll(JSON.stringify(val),"undefined","null"));
      for (let i = 0; i < responseJson['items'].length; i++) {
        this.newBook.next(new Book(isbn, responseJson.items[i].volumeInfo.authors[0],
          responseJson.items[i].volumeInfo.categories[i], 1,
          responseJson.items[i].volumeInfo.description, responseJson.items[i].id,
          responseJson.items[i].volumeInfo.imageLinks.thumbnail, 0, 2, responseJson.items[i].volumeInfo.title));
      }
    });

    this.newId = isbn.toString();
    return this.newBook;
  }


  checkIfBookAlreadyPresent(book) {
    let check: Boolean = true;
    // this.booksArray.map(res => {
    //   if (res.ISBN === book.ISBN) {
    //     check = false;
    //   } else {
    //     check = true;
    //   }
    // });
    for (let i = 0 ; i <  this.booksArray.length ; i++) {
      if (this.booksArray[i].ISBN === book.ISBN) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  addBook(book) {
    this.db.database.ref('/getBooks').child(book.ISBN).set(book).
      then(success => {
        Swal({
          title: 'Added!',
          text: 'Book added successfully',
          type: 'success'
        });
        // this.dialogRefClose.close();
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
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your book is safe :)',
          'error'
        );
      }
    });
  }

  updateBookRecords(id: number, name: string, authorName: string, category: string) {
    this.db.object<Book>('/getBooks/' + id).update({
      title: name,
      authors: authorName,
      categories: category
    });
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
    });
    // this.db.object<Book>("/getBooks/" + bookid).update({
    //   issued: issueNumber + 1,
    //   copies: copiesCount - 1
    // })
    this.db.object<Book>('/getBooks/' + bookid).snapshotChanges().subscribe(response => {
      console.log('in snapshot changes', response);
    });

    const issueBook = {
      'userId': this.auth.userID, 'bookId': booksearched.id.toString(),
      'bookName': booksearched.title.toString(), 'userName': this.auth.getName()
    };
    const ref = this.db.database.ref('/BooksIssued').push(issueBook);
    ref.update({
      id: ref.key,
      issuedDate: this.getTodaysDate()
    });
    // console.log(this.issued);
  }

  checkBookIssued(bookId: number): Observable<any> {
    const result = new BehaviorSubject<boolean>(false);
    const books = this.db.list<IssuedBookDetails>('/IssuedBooks/', ref => ref.orderByChild('userId')
      .equalTo(this.auth.userID)).valueChanges();
    books.subscribe(book => {
      for (const bk of book) {
        console.log(bk.id, bookId);
        if (bk.bookId === bookId) {
          result.next(true);
        }
      }
    });
    return result;
  }

  getIssuedBooksDetails() {
    const books = this.db.list<IssuedBookDetails>('/IssuedBooks/', ref => ref.orderByChild('userId')).valueChanges();
    return books;
  }
  deleteIssuedBookDetails(recordId) {
    this.db.object<IssuedBookDetails>('/IssuedBooks/' + recordId).remove();
  }
  getLikes(bookId) {
    return this.db.object<Book>('/Books/' + bookId).valueChanges();
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
    });

    this.db.object<Book>('/Books/' + bookId).update({
      issued: issueNumber - 1,
      copies: copiesCount + 1
    });

    const issuedBooksDetails = this.db.list<IssuedBookDetails>('/IssuedBooks', ref => ref.orderByChild('bookId')).valueChanges();
    issuedBooksDetails.subscribe(
      bookDetails => {
        for (const book of bookDetails) {
          if (book.bookId === bookId && book.userId === this.auth.getCurrentUserId()) {
            console.log(book);
            console.log(this.auth.getCurrentUserId());
            this.db.object<IssuedBookDetails>('/IssuedBooks/' + book.id).remove();
          }
        }
      }
    );
  }

  getTodaysDate() {
    const TodaysDate = new Date();
    const day = TodaysDate.getDate();
    const month = TodaysDate.getMonth() + 1;
    const year = TodaysDate.getFullYear();
    return (day + '/' + month + '/' + year);
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
