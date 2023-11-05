import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router, ActivatedRoute } from "@angular/router";
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent,FormsModule,MatDatepickerModule,ToolbarComponent],
})
export class LoginComponent  implements OnInit {
  isSetToolbar  : any;
  formData = {
    fullname: '',
    email: '',
    password: '',
    dob:'',
    gender:''
  };
  constructor(private route : ActivatedRoute, private router : Router) {}
  ngOnInit(): void {
    if(this.router.url !== '/texteditor'){
      this.isSetToolbar = true;
      console.log(this.isSetToolbar)
    }else{
      this.isSetToolbar = false;
    }
  }
  login(){

  }
}
