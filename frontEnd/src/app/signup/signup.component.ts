import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/apiservice.service';



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
  OTPVerification: boolean = false;
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
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    
  }
  isUserAbove12(dateOfBirth: string): boolean {
    // Convert input string to Date object
    const dob: Date = new Date(dateOfBirth);

    // Get today's date
    const today: Date = new Date();

    // Calculate age difference in years
    const ageDifferenceInMilliseconds: number = today.getTime() - dob.getTime();
    const ageDifferenceInYears: number =
      ageDifferenceInMilliseconds / (1000 * 3600 * 24 * 365.25);

    // Check if user is above 12 years old
    //console.log(ageDifferenceInYears);
    return ageDifferenceInYears > 12;
  }
  isValidPassword(password: string): boolean {
    // Check length
    if (password.length < 6) {
      this.toast.warning('Password is too short');
      return false; // Password is too short
    }

    // Check complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
      this.toast.warning('Password must include A-Z,a-z,0-9,special character');
      return false; // Password doesn't meet complexity requirements
    }

    return true; // Password meets all criteria
  }
  isValidName(firstName: string, lastName: string): boolean {
    // Check if first name and last name are non-empty strings
    if (firstName.trim() === '' || lastName.trim() === '') {
      this.toast.warning('First name or last name is empty');
      return false; // First name or last name is empty
    }

    // Check if first name and last name contain only letters
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      this.toast.warning(
        'First name or last name contains special characters or numbers'
      );
      return false; // First name or last name contains special characters or numbers
    }

    return true; // Both first name and last name are valid
  }
  signup() {
    if (!this.isValidName(this.formData.firstName, this.formData.lastName)) {
      return;
    }
    if (!this.isUserAbove12(this.formData.dob)) {
      this.toast.warning('User must be atleast 12 years old');
      return;
    }

    if (!this.isValidPassword(this.formData.password)) {
      return;
    }

    if (this.formData.password !== this.formData.passwordConfirm) {
      this.toast.warning('passwords and confirm password does not match!');
      return;
    }

    this.signingIn = true;
    this.api.signup(this.formData).subscribe(
      (response) => {
        //console.log(response);
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
    this.OTPVerification = true;
    this.api.sendOTP(this.userId, this.otp).subscribe(
      (response) => {
        if ('status' in response && response.status === 'success') {
          //console.log(response);
          this.emailVerification = false;
          this.toast.success('Signup Successful');
          this.formData.dob = '';
          this.formData.email = '';
          this.formData.firstName = '';
          this.formData.lastName = '';
          this.formData.password = '';
          this.formData.passwordConfirm = '';
          this.OTPVerification = false;
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
        this.OTPVerification = false;
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
  loginWithGoogle() {
  }
}