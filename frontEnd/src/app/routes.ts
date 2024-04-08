import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
import { MyblogsComponent } from './myblogs/myblogs.component';
import { BlogComponent } from './blog/blog.component';
import { EditProfileComponent } from './edit-profile/editprofile.component';
import { CanActivate } from './Services/Authorization/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';

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
    path: 'editprofile',
    component: EditProfileComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'profile',
    component:ProfileComponent//PageNotFoundComponent,
  },
  {
    path: 'myprofile',
    component:ProfileComponent//PageNotFoundComponent,
  },
  {
    path: 'chat',
    component:ChatComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];
export default routeConfig;
