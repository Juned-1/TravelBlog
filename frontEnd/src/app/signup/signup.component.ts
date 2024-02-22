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
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    dob: '',
    gender: '',
  };
  constructor(
    private router: Router,
    private api: APIService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}
  signup() {
    this.api.signup(this.formData).subscribe(
      (response) => {
        //console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const Data = response.data as userData1;
          let fullName = '';
          if (
            typeof Data.user.firstName === 'string' &&
            typeof Data.user.lastName === 'string'
          ) {
            fullName = Data.user.firstName + ' ' + Data.user.lastName;
          }
          localStorage.setItem('travel-blog', String(fullName));
          this.toast.success('Signup Successful');
          this.router.navigate(['/']);
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
      }
    );
  }
  change() {
    this.router.navigate(['/login']);
  }
  loginWithGoogle(){

  }
}
