import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/apiservice.service';
import { userData1 } from 'src/DataTypes';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    ToolbarComponent,
  ],
})
export class SignupComponent implements OnInit {
  emailVerification: boolean = false;
  signingIn: boolean = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    dob: '',
    gender: '',
  };
  otp: string = '';
  userId: string = '';
  constructor(
    private router: Router,
    private api: APIService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}
  signup() {
    this.signingIn = true;
    this.api.signup(this.formData).subscribe(
      (response) => {
        console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.userId = (response.data as { id: string }).id as string;
          this.signingIn = false;
          this.emailVerification = true;
          this.toast.success('OTP successfully sent to your email');
          // localStorage.setItem('travel-blog', String(fullName));
        }
      },
      (err) => {
        if (err.status === 422 && err.error.status === 'error') {
          this.toast.warning(err.error.message);
        } else if (err.status === 400 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if (err.status === 409 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        }
        this.signingIn = false;
      }
    );
  }
  change() {
    this.router.navigate(['/login']);
  }
  summitOTP() {
    this.api.sendOTP(this.userId, this.otp).subscribe(
      (response) => {
        if ('status' in response && response.status === 'success') {
          console.log(response);
          this.emailVerification = false;
          this.toast.success('Signup Successful');
          this.router.navigate(['/login']);
        }
      },
      (err) => {
        if (err.status === 422 && err.error.status === 'error') {
          this.toast.warning(err.error.message);
        } else if (err.status === 400 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if (err.status === 409 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        }
        this.signingIn = false;
      }
    );
  }
  resendOTP() {
    this.api.resendOTP(this.userId).subscribe(
      (response) => {
        if ('status' in response && response.status === 'success') {
          this.toast.success((response as any).message);
        }
      },
      (err) => {
        if (err.status === 422 && err.error.status === 'error') {
          this.toast.warning(err.error.message);
        } else if (err.status === 400 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if (err.status === 409 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        }
        this.signingIn = false;
      }
    );
  }
  loginWithGoogle() {}
}
