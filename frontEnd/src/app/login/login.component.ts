import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { credentials } from './dummy';
import { MyblogsComponent } from '../myblogs/myblogs.component';
import { LoginService } from '../login.service';
import { APIService } from 'src/apiservice.service';
import {ToastrService} from "ngx-toastr";
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponent,
    FormsModule,
    MatDatepickerModule,
    ToolbarComponent,
    MyblogsComponent,
    
  ],
})
export class LoginComponent implements OnInit {
  isSetToolbar: any;
  formData = {
    email: '',
    password: '',
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    console.log("I am here");
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
      console.log(this.isSetToolbar);
    } else {
      this.isSetToolbar = false;
    }
  }
  // login(){
  //   // var formData: any = new FormData();
  //   // if(this.formData.valid){
  //   //   // this.isLoading = true
  //   //   formData.append('email', this.formData.get('email').value);
  //   //   formData.append('password', this.formData.get('password').value);
  //   //   console.log(this.formData)
  //   //   this.auth.userLogin(formData).subscribe((data:any)=>{
  //   //     console.log(data);
  //   //   });
  //   // }  
  // }
  login() {
    const username = this.formData.email;
    const password = this.formData.password;

    credentials.forEach((check) => {
      if (check.email === username && check.password === password) {

        this.loginService.credentials = check;
        console.log(check);
        this.loginService.loggedIn = true;
        this.router.navigate(['/']);
      }
    });

    if(!this.loginService.loggedIn){
      alert('Invalid credentials');
      console.log("Not logged iN");
    }

    // this.api.login(this.formData).subscribe(
    //   (res) => {
    //     this.toast.success("Login Succesfull");
    //     this.router.navigate(["/"]);
    //   },
    //   (err) => {
    //     if(err.status === 401){
    //       this.toast.error(err.error)
    //     }
    //     else if(err.status === 403){
    //       this.toast.warning(err.error)
    //     }
    //     if(err.status === 422){
    //       const data = JSON.parse(JSON.stringify(err.error.errors));
    //       this.toast.warning(data[0].msg);
    //     }
    //   }
    // );
  }
  change(){
    this.router.navigate(['/signup']);
  }
}
