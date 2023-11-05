import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { data } from './dummyData';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ToolbarComponent } from '../toolbar/toolbar.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule,ToolbarComponent],
})
export class HomePage implements OnInit, AfterViewInit{
  blogPosts = data;
  signedIn = true;//If the user is signed in then show create post button otherwise signIn button
  isSetToolbar : any;
  constructor(private route : ActivatedRoute, private router : Router) {

  }
  ngOnInit(): void {
    if(this.router.url !== '/texteditor'){
      this.isSetToolbar = true;
    }else{
      this.isSetToolbar = false;
    }
  }
  ngAfterViewInit(){
  }
  LogIn(){
    this.router.navigate(['/texteditor']);
  }
}
