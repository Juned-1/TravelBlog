import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { credentials } from '../login/dummy';
import { ToastrService } from 'ngx-toastr';
//import { HttpClientModule, HttpClient } from '@angular/common/http';
import { APIService } from 'src/apiservice.service';
import { HttpErrorResponse } from '@angular/common/http';
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

export class SignupComponent  implements OnInit {
  formData = {
    firstName: '',
    lastName : '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  };
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private toast : ToastrService) {}

  ngOnInit(): void {
    
  }
  signup(){
      this.api.signup(this.formData).subscribe((response)=>{
        if('message' in response && response.message === 'ok' && 'result' in response){
            localStorage.setItem('travel-blog',String(response.result));
            this.toast.success("Signup Successful");
            this.router.navigate(['/']);
        }
        if(response){
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