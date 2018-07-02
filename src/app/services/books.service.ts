import { Injectable, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Book } from '../book-details/book.modal';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { BookDetailsComponent } from '../book-details/book-details.component';
import { AuthService } from './auth.service';
import { IssuedBookDetails } from './issuedBookDetails.modal';

@Injectable()
export class BooksService {

  searchValue = new BehaviorSubject<string>('');
  books: Observable<any>;
  booksArray: Book[] = [];
  book: Book;
  newBook = new BehaviorSubject<Book>(null);
  newId: string;
  responseJson: any;

  constructor(private db: AngularFireDatabase, private http: HttpClient, private router: Router,
    private auth: AuthService) {
  }

  getAllBooks() {
    this.books = this.db.list<Book>('/getBooks').valueChanges();
    // this.db.list<Book>('/getBooks').valueChanges().subscribe(response => {
    //   this.booksArray = response;
    // });
    return this.books;
  }


  searchBook(value) {
    this.searchValue.next(value);
  }

  serachBookByISBN(isbn): Observable<Book> {
    this.http.get('https://www.googleapis.com/books/v1/volumes/?q=isbn:' + isbn).subscribe((response) => {
      this.responseJson = response;
      console.log(this.responseJson.items);
      // console.log('lets see when parsing the data in string how it comes' , JSON.parse( JSON.stringify(responseJson )));
      this.responseJson = JSON.parse(JSON.stringify(this.responseJson));
      // JSON.parse(replaceAll(JSON.stringify(val),"undefined","null"));
      for (let i = 0; i < this.responseJson['items'].length; i++) {
        this.newBook.next(new Book(isbn, this.responseJson.items[i].volumeInfo.authors[0],
          this.responseJson.items[i].volumeInfo.categories[i], 1,
          this.responseJson.items[i].volumeInfo.description, this.responseJson.items[i].id,
          this.responseJson.items[i].volumeInfo.imageLinks.thumbnail, 0, 2, this.responseJson.items[i].volumeInfo.title));
      }
    });

    this.newId = isbn.toString();
    return this.newBook;
  }


  // checkIfBookAlreadyPresent(book) {
  //   let check: Boolean = true;
  //   for (let i = 0; i < this.booksArray.length; i++) {
  //     if (this.booksArray[i].ISBN === book.ISBN) {
  //       check = true;
  //     } else {
  //       check = false;
  //       break;
  //     }
  //   }
  //   return check;
  // }

  likeBook(bookId: number) {
    let booksearched;
    let likes;
    this.booksArray.filter(book => {
      if (book.ISBN === bookId) {
        booksearched = book;
        likes = book.likes;
      }
    });
    this.db.object<Book>('/getBooks/' + bookId).update({
      likes: likes + 1,
    });

    const likeBook = {
      'userId': this.auth.userID, 'bookId': booksearched.ISBN.toString(),
      'bookName': booksearched.title.toString(), 'userName': this.auth.getName(),
    };
    this.db.database.ref('/LikedBooks').child(likeBook.bookId).set(likeBook);
  }

  unLikeBook(bookId) {
    this.db.list<IssuedBookDetails>('/BooksIssued', ref => ref.orderByChild('bookId')).valueChanges().subscribe(
      bookDetails => {
        for (const book of bookDetails) {
          console.log(book.bookId);
          if (book.bookId === bookId && book.userId === this.auth.userID) {
            this.db.object<IssuedBookDetails>('/LikedBooks/' + book.bookId).remove();
          }
        }
      }
    );
  }

  getBookLikedByUser() {
    return this.db.list('/LikedBooks', ref => ref.orderByChild('userId')
      .equalTo(this.auth.userID)).valueChanges();
  }

  addBook(book) {
    this.db.database.ref('/getBooks').child(book.ISBN).set(book).
      then(success => {
        Swal({
          title: 'Added!',
          text: 'Book added successfully',
          type: 'success'
        });
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
      }
    });
  }

  updateBookRecords(id: number, name: string, authorName: string, category: string) {
    this.db.object<Book>('/getBooks/' + id).update({
      title: name,
      authors: authorName,
      categories: category
    });
    Swal({
      title: 'Updated!',
      text: 'Book successfully updated',
      type: 'success'
    });
  }

  issueBook(bookid: number , bookName) {
    let booksearched: Book;
    let issueNumber: number;
    let copiesCount: number;
    this.booksArray.filter(book => {
      if (book.ISBN === bookid) {
        booksearched = book;
        issueNumber = book.issued;
        copiesCount = book.copies;
      }
    });
    // this.db.object<Book>('/getBooks/' + bookid).update({
    //   issued: issueNumber + 1,
    //   copies: copiesCount - 1,
    // });

    const issueBook = {
      'userId': this.auth.userID, 'bookId': bookid,
      'bookName': bookName, 'userName': this.auth.getName(),
      'issueDate': this.getTodaysDate(), 'returnDate': this.returnDate()
    };

    const ref = this.db.database.ref('/BooksIssued').push(issueBook);
    ref.update({
      id: ref.key
    });
  }

  // addIssuedBookArray() {
  //   this.db.list<IssuedBookDetails>('/BooksIssued/', ref => ref.orderByChild('userId')
  //     .equalTo(this.auth.userID)).valueChanges();
  // }

  getIssuedBooksByUser() {
    return this.db.list('/BooksIssued/', ref => ref.orderByChild('userId')
      .equalTo(this.auth.userID)).valueChanges();
  }

  returnBook(bookId: number ) {
    // let issueNumber: number;
    // let copiesCount: number;

    // this.booksArray.filter(book => {
    //   if (book.ISBN === bookId) {
    //     issueNumber = book.issued;
    //     copiesCount = book.copies;
    //   }
    // });

    const issuedBooksDetails = this.db.list<IssuedBookDetails>('/BooksIssued', ref => ref.orderByChild('bookId')).valueChanges();
    issuedBooksDetails.subscribe(
      bookDetails => {
        for (const book of bookDetails) {
          if (book.bookId.toString() === bookId.toString() && book.userId === this.auth.userID) {
            this.db.object<IssuedBookDetails>('/BooksIssued/' + book.id).remove();
          }
        }
      }
    );
    // this.db.object<Book>('/getBooks/' + bookId).update({
    //   issued: issueNumber - 1,
    //   copies: copiesCount + 1,
    // });
  }

  getTodaysDate() {
    const TodaysDate = new Date();
    const day = TodaysDate.getDate();
    const month = TodaysDate.getMonth() + 1;
    const year = TodaysDate.getFullYear();
    return (day + '/' + month + '/' + year);
  }

  returnDate() {
    const TodaysDate = new Date();
    let day = TodaysDate.getDate() + 10;
    let month = TodaysDate.getMonth() + 1;
    let year = TodaysDate.getFullYear();
    if (day > 30) {
      day = day - 30;
      month += 1;
      if (month > 12) {
        year += 1;
      }
    }
    return (day + '/' + month + '/' + year);
  }

}

