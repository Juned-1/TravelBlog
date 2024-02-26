import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/Authentication/auth.service';
import { UserData } from 'src/DataTypes';

@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ToolbarComponent],
})
export class LoginComponent implements OnInit {
  formData = {
    email: '',
    password: '',
  };
  authService: AuthService = inject(AuthService);
  constructor(
    private router: Router,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {}
  login() {
    this.api.login(this.formData).subscribe({
      next: (response) => {
        console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const Data = response.data as UserData;
          let fullName = '';
          fullName = Data.user.firstName + ' ' + Data.user.lastName;
          localStorage.setItem('travel-blog', String(fullName));
          this.authService.user = fullName;
          this.authService.loggedIn = true;
          this.toast.success("LoggedIn Succesfully");
          this.router.navigate(['/']);
        } else {
          console.log(response);
        }
      },
      error: (err) => {
        if (err.status === 401 && err.error.status === 'fail') {
          this.toast.warning(err.error.message);
        } else if ((err.status = 422 && err.error.status === 'error')) {
          this.toast.error(err.error.message);
        }
      },
    });
  }
  change() {
    this.router.navigate(['/signup']);
  }
  loginWithGoogle(){
    
  }
}
