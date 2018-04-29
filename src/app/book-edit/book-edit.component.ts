import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BooksService } from "../services/books.service";
import { Book } from "../book-details/book.modal";
import { AllbooksComponent } from '../allbooks/allbooks.component';
@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {

  name: string;
  authorName: string;
  category: string;
  book: Book;
  bookData;
  categories = [];
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public bookService: BooksService) { }

  ngOnInit() {
    this.bookData = this.data.bookDetails;
    // this.categories = this.allbook.categories;
    this.getCategories();
  }

  getCategories(): any {
    this.bookService.getAllBooks().subscribe(response => {
      response.map(res => {
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

  submitBookDetails(name?: string, authorName?: string, category?: string) {
    this.bookService.updateBookRecords(this.data.bookDetails.id, name, authorName, this.category);
  }
}
