import { Routes } from '@angular/router';
import { MyblogsComponent } from './myblogs/myblogs.component';
import { SignupComponent } from './signup/signup.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { LoginComponent } from './login/login.component';
<<<<<<< HEAD
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
=======
import { Authguard } from './authorization/authguard';
>>>>>>> 931b562e5a3acf518143fe2b04051053c24d91f2

const routeConfig: Routes = [
  {
    path: '',
<<<<<<< HEAD
    component: HomeComponent,
    title: 'Welcome Page'
=======
    component: HomePage,
    title: 'Home page',
    canActivate : [Authguard],
    data : {
      userType : 'guest'
    }
>>>>>>> 931b562e5a3acf518143fe2b04051053c24d91f2
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
<<<<<<< HEAD
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
=======
    title : 'Log In',
    canActivate : [Authguard],
    data : {
      userType : 'non-loggedin'
    }
>>>>>>> 931b562e5a3acf518143fe2b04051053c24d91f2
  }
];

export default routeConfig;