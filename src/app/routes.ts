import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { SignupComponent } from './signup/signup.component';

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
];

export default routeConfig;