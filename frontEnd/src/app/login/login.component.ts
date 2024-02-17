import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    ToolbarComponent,
  ],
})
export class LoginComponent  implements OnInit {
  isLoggedIn = false;
  formData = {
    email: '',
    password: ''
  };
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private toast : ToastrService) {}
  ngOnInit(): void {

  }
  login(){
    this.api.login(this.formData).subscribe((response)=>{
      //console.log(response);
      if('status' in response && response.status === 'success' && 'data' in response){
        interface userData {
          user: {
            id: String;
            email: String;
            firstName: String;
            lastName: String;
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
      }      
      this.router.navigate(["/"]);
    },
    (err) => {
      //console.log(err);
      if(err.status === 401 && err.error.status === 'fail'){
        this.toast.warning(err.error.message);
      }else if(err.status = 422 && err.error.status === "error"){
        this.toast.error(err.error.message);
      }
    }
    );
  }
  change(){
    this.router.navigate(['/signup']);
  }
}