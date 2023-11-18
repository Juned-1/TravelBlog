import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { credentials } from '../login/dummy';
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  };
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

    if (valid) {
      credentials.push(this.formData);
      this.router.navigate(['/login']);
    }
    else{
      alert('email already taken!!')
    }
    console.log(credentials);
  }
}
