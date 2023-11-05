import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home page',
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
  }
];

export default routeConfig;