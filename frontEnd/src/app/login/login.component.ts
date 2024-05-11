import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/Authentication/auth.service';
import { UserData } from 'src/DataTypes';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { error } from 'console';

@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GoogleSigninButtonModule],
})
export class LoginComponent implements OnInit {
  user!: SocialUser;

  formData = {
    email: '',
    password: '',
  };
  authService: AuthService = inject(AuthService);
  constructor(
    private router: Router,
    private api: APIService,
    private toast: ToastrService,
    private authSocialService: SocialAuthService
  ) {}
  ngOnInit(): void {
    this.authSocialService.authState.subscribe((user) => {
      console.log('user',user);
      this.user = user;
      this.sendGoogleTokenToServer(user.idToken);
    });
  }
  sendGoogleTokenToServer(idToken: string) {
    this.api.googleLogin(idToken).subscribe({
      next: (response) => {
        console.log('response',response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const Data = response.data as UserData;
          let fullName = '';
          fullName = Data.user.firstName + ' ' + Data.user.lastName;
          const userId = Data.user.id;
          localStorage.setItem('travel-blog', String(fullName));
          localStorage.setItem('currentUserId', String(userId));
          this.authService.user = fullName;
          this.authService.loggedIn = true;
          this.toast.success('LoggedIn Succesfully');
          this.router.navigate(['/']);
        } else {
          console.log(response);
        }
      },
      error: (err) => {
        if (err.status === 401 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if ((err.status = 422 && err.error.status === 'error')) {
          this.toast.error(err.error.message);
        }
      },
    });
  }
  login() {
    this.api.login(this.formData).subscribe({
      next: (response) => {
        console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const Data = response.data as UserData;
          let fullName = '';
          fullName = Data.user.firstName + ' ' + Data.user.lastName;
          const userId = Data.user.id;
          localStorage.setItem('travel-blog', String(fullName));
          localStorage.setItem('currentUserId', String(userId));
          this.authService.user = fullName;
          this.authService.loggedIn = true;
          this.toast.success('LoggedIn Succesfully');
          this.router.navigate(['/']);
        } else {
          console.log(response);
        }
      },
      error: (err) => {
        if (err.status === 401 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if ((err.status = 422 && err.error.status === 'error')) {
          this.toast.error(err.error.message);
        }
      },
    });
  }
  change() {
    this.router.navigate(['/signup']);
  }
  forgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
  loginWithGoogle() {}
}
