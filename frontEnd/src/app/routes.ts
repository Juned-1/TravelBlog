import { Routes } from '@angular/router';
import { MyblogsComponent } from './myblogs/myblogs.component';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Welcome Page'
  },
  {
    path: 'signup',// details/:id
    component: SignupComponent,
    title: 'Sign Up',
  },
  {
    path : 'texteditor',
    component : TexteditorComponent,
    title : 'Editor',
  },
  {
    path : 'login',
    component : LoginComponent,
    title : 'Log In'
  },
  {
    path: 'blog',
    component: BlogComponent,
    title: 'Home page',
  },
  {
    path: 'myblogs',
    component: MyblogsComponent,
    title: 'My Blogs',
  }
];

export default routeConfig;