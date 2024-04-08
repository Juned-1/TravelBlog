import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { userDetails, data1 } from 'src/DataTypes';

@Component({
  selector: 'editapp-profile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
  standalone: true,
  imports: [
    ToolbarComponent,
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    FormsModule,
  ],
})
export class EditProfileComponent implements OnInit {
  isLoggedIn = true;
  password = { password: '', passwordConfirm: '' };
  toggleChangePassword = false;
  toggleChangeEmail = false;
  newEmail: string = '';
  emailVerification = false;
  otp: string = '';
  processing = false;
  formData: userDetails = {
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    // password: '',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.api.getUserDetails('').subscribe(
      (response) => {
        // console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.formData = (response.data as data1).userDetails as userDetails;
          this.formData.dob = new Date(this.formData.dob)
            .toISOString()
            .split('T')[0];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  makeChanges() {
    console.log('hello');
    if (this.toggleChangePassword === true) {
      this.changePassword();
      return;
    }
    if (this.emailVerification === true) {
      this.updateEmail();
      return;
    }
    if (this.toggleChangeEmail === true) {
      this.updateEmailVerification();
      return;
    }

    this.api.setUserDetails(this.formData).subscribe(
      (response) => {
        // console.log(response);
        if ('status' in response && response.status === 'success') {
          this.toast.success('Profile Edited successfully');
          this.router.navigate(['/profile']);
        }
      },
      (err) => {
        this.toast.error('Profile Edit unsuccessful');
        console.log(err);
      }
    );
  }

  updatePasswordVerification() {
    this.toggleChangeEmail = false;
    this.api.updatePasswordVerification(this.formData.email).subscribe({
      next: (response) => {
        console.log(response);
        //{status: 'success', value: true}
        if ('status' in response && response.status === 'success') {
          if ('value' in response && response.value === true) {
            // this.toast.success('Enter new password');
            this.toggleChangePassword = true;
          } else this.toast.warning('ERROR');
        }
      },
      error: (error) => {
        this.toast.error('Error! Please try again later');
      },
    });
  }
  changePassword() {
    if (this.password.password !== this.password.passwordConfirm) {
      this.toast.warning('Password does not match!');
      return;
    }
    this.api.updatePassword(this.password).subscribe({
      next: (response) => {
        console.log(response);
        //{status: 'success', message: 'Password is updated successfully'}
        if ('status' in response && response.status === 'success') {
          if ('message' in response) {
            const message: string = response.message as string;
            this.toast.success(message);
            this.password.password = '';
            this.password.passwordConfirm = '';
            this.toggleChangePassword = false;
          }
        } else {
          this.toast.error('Error! Please try again later');
        }
      },
      error: (error) => {
        this.toast.error('Error! Please try again later');
      },
    });
  }
  initiateEmailVerification() {
    this.toggleChangePassword = false;
    this.toggleChangeEmail = true;
  }
  updateEmailVerification() {
    this.processing = true;
    this.api
      .updateEmailVerification(this.formData.email, this.newEmail)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.emailVerification = true;
          this.toast.success(`Otp sent to ${this.newEmail}`);
          this.processing = false;
          //{status: 'success', message: 'Verification code is sent to hi@gmail.com', data: {…}}
        },
        error: (error) => {
          console.log(error);
          this.toast.error('Error! Please try again later');
          this.processing = false;
        },
      });
  }
  updateEmail() {
    this.processing = true;
    this.api.updateEmail(this.otp, this.newEmail).subscribe({
      next: (response) => {
        console.log(response);

        this.ngOnInit();
        this.toast.success('Email is updated successfully');
        this.cancel();
        this.processing = false;
        this.newEmail = '';
      },
      error: (error) => {
        console.log(error);
        this.toast.error('Error! Please try again later');
        this.processing = false;
        this.newEmail = '';
      },
    });

  }
  cancel() {
    this.toggleChangePassword = false;
    this.toggleChangeEmail = false;
    this.emailVerification = false;
  }
}
