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

export class SignupComponent  implements OnInit {
  isLoggedIn = false;
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
  change(){
    this.router.navigate(['/login']);
  }
}