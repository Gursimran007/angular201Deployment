import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { AllbooksComponent } from './allbooks/allbooks.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from './../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { StarRatingModule } from 'angular-star-rating';
import { AuthService } from './services/auth.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppRoutingModule } from './app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import 'hammerjs';
import { BooksService } from './services/books.service';
import {MatRadioModule} from '@angular/material/radio';
import { AddbookComponent } from './addbook/addbook.component';
import swal from 'sweetalert';
import { AuthGuardService } from './services/authGuard.service';
import { BookEditComponent } from './book-edit/book-edit.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserDetailService } from './services/userDetail.service';
import { FooterComponent } from './footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    AllbooksComponent,
    BookDetailsComponent,
    NavbarComponent,
    LoginComponent,
    SignUpComponent,
    UserProfileComponent,
    DashboardComponent,
    AddbookComponent,
    BookEditComponent,
    UserEditComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [AuthService , BooksService , AuthGuardService , UserDetailService],
  entryComponents: [AddbookComponent , BookEditComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
