import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
=======
import { credentials } from './dummy';
import { MyblogsComponent } from '../myblogs/myblogs.component';
import { LoginService } from '../login.service';

>>>>>>> origin
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
<<<<<<< HEAD
export class LoginComponent  implements OnInit {
  formData = {
    email: '',
    password: ''
  };
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private toast : ToastrService) {}
  ngOnInit(): void {
=======
export class LoginComponent implements OnInit {
  isSetToolbar: any;
  formData = {
    email: '',
    password: '',
  };
  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) {}
  ngOnInit(): void {
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
      console.log(this.isSetToolbar);
    } else {
      this.isSetToolbar = false;
    }
  }
  login() {
    const username = this.formData.email;
    const password = this.formData.password;
>>>>>>> origin

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
  }
  login(){
    this.api.login(this.formData).subscribe((response)=>{
      this.toast.success("Login successful");
      this.router.navigate(["/"]);  
    },
    (err) => {
      console.log(err);
      if(err.status === 401){
        this.toast.error(err.error);
      }else if(err.status === 403){
        this.toast.warning(err.error);
      }else if(err.status = 422){
        const data = JSON.parse(JSON.stringify(err.error.errors));
        this.toast.warning(data[0].msg);
      }
    }
    );
  }
}
