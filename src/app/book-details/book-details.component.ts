import { Component, OnInit , Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SlicePipe } from '@angular/common';
import 'rxjs/add/operator/toPromise';
import { BooksService } from '../services/books.service';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { AllbooksComponent } from '../allbooks/allbooks.component';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  private id: string;
  book: any;
  avatar;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any , public dialogRefClose:MatDialogRef<BookDetailsComponent> , private db: AngularFireDatabase  , private route: ActivatedRoute ,
   public bk: BooksService , public dialog: MatDialog) {  }
  ngOnInit() {
   this.id = this.route.snapshot.params['id'];
   this.book = this.data.bookDetails;
   console.log(this.book);
  }

  getBookData(path) {
    this.db.object(path).valueChanges().withLatestFrom().subscribe(res => {
      this.book = res;
      console.log('value of the book object inside', this.book);
    });
    return this.book;
  }

  deleteBook(id){
    console.log(id);
    this.bk.deleteBook(id);
    this.dialogRefClose.close();
  }

  openEditDialog(){
    this.dialogRefClose.close();
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: '500px',
      height: '420px',
      data: {
        bookDetails: this.book
      }
    });
  }
}
