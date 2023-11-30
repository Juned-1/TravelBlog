import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
import { Authguard } from './authorization/authguard';
import { MyblogsComponent } from './myblogs/myblogs.component';
import { BlogComponent } from './blog/blog.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    canActivate : [Authguard],
    data : {
      userType : 'guest'
    }
  },
  {
    path: 'signup',// details/:id
    component: SignupComponent,
    title: 'Sign Up',
    canActivate : [Authguard],
    data : {
      userType : 'non-loggedin',
    }
  },
  {
    path : 'texteditor',
    component : TexteditorComponent,
    title : 'Editor',
    canActivate : [Authguard],
    data  : {
      userType : 'logged-in',
    }
  },
  {
    path : 'login',
    component : LoginComponent,
    title : 'Log In',
    canActivate : [Authguard],
    data : {
      userType : 'non-loggedin'
    }
  },
  {
    path : 'userblog',
    component  : MyblogsComponent,
    canActivate : [Authguard],
    data : {
      userType : 'logged-in'
    }
  },
  {
    path : 'blog-details',
    component  : BlogComponent,
    canActivate : [Authguard],
    data : {
      userType : 'guest'
    }
  }
];

export default routeConfig;