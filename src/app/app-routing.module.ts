import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { AllbooksComponent } from './allbooks/allbooks.component';
import { AuthGuardService } from './services/authGuard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';


const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path : 'login' , component : LoginComponent},
    {path : 'dashboard' , component : DashboardComponent, canActivate : [AuthGuardService]},
    {path : 'signup' , component : SignUpComponent},
    {path : 'library' , component : AllbooksComponent , canActivate : [AuthGuardService]},
    {path : 'library/:id' , component : BookDetailsComponent},
    {path: 'userProfile' , component : UserProfileComponent , canActivate : [AuthGuardService] }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
// { enableTracing: true }
export class AppRoutingModule { }
