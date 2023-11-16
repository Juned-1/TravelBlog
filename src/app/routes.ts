import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
import { Authguard } from './authorization/authguard';

const routeConfig: Routes = [
  {
    path: '',
    component: HomePage,
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
  }
];

export default routeConfig;