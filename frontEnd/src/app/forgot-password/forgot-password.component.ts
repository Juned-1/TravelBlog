import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ForgotPasswordComponent implements OnInit {
  summiting: boolean = false;
  userid: string = '';
  emailVerification: boolean = false;
  email: string = '';
  otp: string = '';
  password: { password: string; confirmPassword: string } = {
    password: '',
    confirmPassword: '',
  };

  constructor(
    private api: APIService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {}
  summitEmail() {
    this.summiting = true;
    this.api.validateEmail(this.email).subscribe({
      next: (response) => {
        this.userid = (response as { data: string; id: string }).id as string;
        this.emailVerification = true;
        this.summiting = false;
        this.toast.success('OTP sent to your email');
      },
      error: (err) => {
        this.summiting = false;
        //console.log(err);
      },
    });
  }

  summitOTPWithNewPasswords() {
    if(this.password.password !== this.password.confirmPassword){
      this.toast.warning('password and confirm password does not match');
      return;
    }

    const body: { password: string; passwordConfirm: string; token: string } = {
      password: this.password.password,
      passwordConfirm: this.password.confirmPassword,
      token: this.otp,
    };

    this.api.resetPassword(this.userid, body).subscribe({
      next: (response) => {
        const message: string = (
          response as { status: string; message: string }
        ).message as string;
        this.toast.success(message);

        this.emailVerification = false;
        this.password.password = '';
        this.password.confirmPassword = '';
        this.email = '';
        this.otp = '';

        this.router.navigate(['/login']);
      },
      error: (err) => {
        //console.log(err);
      },
    });
  }
  resendOTP(){
    this.summitEmail();
  }
}
