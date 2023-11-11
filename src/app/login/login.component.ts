import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { credentials } from './dummy';
import { HomePage } from '../home/home.page';
import { LoginService } from '../login.service';

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
    HomePage,
  ],
})
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
}
