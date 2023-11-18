import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ToastrService } from 'ngx-toastr';
//import { HttpClientModule, HttpClient } from '@angular/common/http';
import { APIService } from 'src/apiservice.service';
import { HttpErrorResponse } from '@angular/common/http';
=======
import { credentials } from '../login/dummy';
>>>>>>> origin
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
<<<<<<< HEAD
export class SignupComponent  implements OnInit {
=======
export class SignupComponent implements OnInit {
  isSetToolbar: any;
>>>>>>> origin
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  };
<<<<<<< HEAD
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private toast : ToastrService) {}
  ngOnInit(): void {
=======
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
      console.log(this.isSetToolbar);
    } else {
      this.isSetToolbar = false;
    }
  }
  signup() {
    let valid = true;
    credentials.forEach((credential) => {
      if (credential.email == this.formData.email) {
        valid = false;
      }
    });
>>>>>>> origin

    if (valid) {
      credentials.push(this.formData);
      this.router.navigate(['/login']);
    }
    else{
      alert('email already taken!!')
    }
    console.log(credentials);
  }
  signup(data : any){
      this.api.signup(this.formData).subscribe((response)=>{
        if(response instanceof Object){
          this.toast.success("Signup Successful");
          this.router.navigate(['/']);
        }
      },
      (err) => {
        console.log(err);
        if(err.status === 401){
          this.toast.error("User already registered");
        }
        else if(err.status === 422){
          const data = JSON.parse(JSON.stringify(err.error.errors));
          this.toast.warning(data[0].msg);
        }
      }
      );
  }
}
