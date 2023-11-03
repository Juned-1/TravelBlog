import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent,FormsModule,MatDatepickerModule],
})
export class SignupComponent  implements OnInit {

  formData = {
    fullname: '',
    email: '',
    password: '',
    dob:'',
    gender:''
  };

  constructor() { }

  ngOnInit() {}

  signup() {
    
  }

}
