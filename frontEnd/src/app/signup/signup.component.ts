import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { credentials } from '../login/dummy';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponent,
    FormsModule,
    MatDatepickerModule,
    ToolbarComponent,
  ],
})
export class SignupComponent implements OnInit {
  isSetToolbar: any;
  formData = {
    // firstName: '',
    // lastName: '',
    fullname: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
      console.log(this.isSetToolbar);
    } else {
      this.isSetToolbar = false;
    }
  }
  signup() {
    //   let valid = true;
    //   credentials.forEach((credential) => {
    //     if (credential.email == this.formData.email) {
    //       valid = false;
    //     }
    //   });

    //   if (valid) {
    //     credentials.push(this.formData);
    //     this.router.navigate(['/login']);
    //   }
    //   else{
    //     alert('email already taken!!')
    //   }
    //   console.log(credentials);
    // }
    console.log("Pahauch raha hai");
    this.api.signup(this.formData).subscribe(
      (res) => {
        console.log("andar bhi");
        if (res instanceof Object) {
          this.toast.success('Signup Succesfull');
          this.router.navigate(['/']);
        }
      },
      (err) => {
        console.log(err,"ERRORRRRR");
        if (err.status === 401) {
          this.toast.error('User already registered');
        }
        if (err.status === 422) {
          const data = JSON.parse(JSON.stringify(err.error.errors));
          this.toast.warning(data[0].msg);
        }
      }
    );
  }
  change(){
    this.router.navigate(['/login']);
  }
}
