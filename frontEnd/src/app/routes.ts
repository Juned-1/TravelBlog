import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
import { MyblogsComponent } from './myblogs/myblogs.component';
import { BlogComponent } from './blog/blog.component';
import { ProfileComponent } from './profile/profile.component';
import { CanActivate } from './Services/Authorization/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommentsComponent } from './comments/components/comments/comments.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up',
  },
  {
    path: 'blogdetails',
    component: BlogComponent,
  },
  {
    path: 'texteditor',
    component: TexteditorComponent,
    title: 'Editor',
    canActivate: [CanActivate],
  },
  {
    path: 'userblog',
    component: MyblogsComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'trash',
    component: PageNotFoundComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];
export default routeConfig;
