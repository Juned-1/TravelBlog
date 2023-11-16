import { AfterViewInit, Component, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { data } from './dummyData';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { APIService } from 'src/apiservice.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule,ToolbarComponent],
})
export class HomePage implements OnInit, AfterViewInit{
  isLoggedIn = false;
  blogPosts = data;
  signedIn = true;//If the user is signed in then show create post button otherwise signIn button
  isSetToolbar : any;
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService) {

  }
  ngOnInit(): void {
    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        if(data.message === "Token verified"){
          this.isLoggedIn = false;
        }
      },
      (err) => {
        this.isLoggedIn = true;
      }
    );
    if(this.router.url !== '/texteditor'){
      this.isSetToolbar = true;
    }else{
      this.isSetToolbar = false;
    }
  }
  ngAfterViewInit(){
  }

  goToEditor(){
    this.router.navigate(['/texteditor']);
  }
  logoutHandle(value : any){
    if(value === 'logout'){
      this.api.logout().subscribe(
      (response) => {
        this.isLoggedIn = true;
        console.log(response);
      },
      (err) => {
        console.log(err.error.message);
      }
    );
    }
  }
}
