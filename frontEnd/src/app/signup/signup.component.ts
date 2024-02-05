import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
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
  isLoggedIn = false;
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
    private route: ActivatedRoute,
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
          interface userData {
            user: {
              id: String;
              firstName: String;
              lastName: String;
              email: String;
              dob: Date;
              gender: String;
            };
          }
          const Data = response.data as userData;
          let fullName = '';
          if(typeof Data.user.firstName === 'string' && typeof Data.user.lastName === 'string'){
            fullName = Data.user.firstName + " " + Data.user.lastName
          }
          //console.log(fullName)
          localStorage.setItem(
            'travel-blog',
            String(fullName)
          );
          this.toast.success('Signup Successful');
          this.router.navigate(['/']);
        }
        // if(response){
        // }
      },
      (err) => {
        //console.log(err);
        if (err.status === 422 && err.error.status === 'error') {
          //const data = JSON.stringify(err.error.message);
          this.toast.warning(err.error.message);
        } else if (err.status === 400 && err.error.status === 'fail') {
          //const data = err.error.message;
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
}
